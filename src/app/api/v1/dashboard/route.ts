import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fleet stats
    const [totalBuses, activeBuses, maintenanceBuses, breakdownBuses, idleBuses] = await Promise.all([
      prisma.vehicle.count({ where: { deletedAt: null } }),
      prisma.vehicle.count({ where: { status: "ACTIVE" } }),
      prisma.vehicle.count({ where: { status: "MAINTENANCE" } }),
      prisma.vehicle.count({ where: { status: "BREAKDOWN" } }),
      prisma.vehicle.count({ where: { status: "IDLE" } }),
    ]);

    // Trip stats for today
    const [todayTrips, completedTrips, cancelledTrips, activeTrips] = await Promise.all([
      prisma.trip.count({
        where: {
          scheduledDeparture: { gte: today, lt: tomorrow },
        },
      }),
      prisma.trip.count({
        where: {
          scheduledDeparture: { gte: today, lt: tomorrow },
          status: { in: ["COMPLETED", "ARRIVED"] },
        },
      }),
      prisma.trip.count({
        where: {
          scheduledDeparture: { gte: today, lt: tomorrow },
          status: "CANCELLED",
        },
      }),
      prisma.trip.count({
        where: {
          scheduledDeparture: { gte: today, lt: tomorrow },
          status: { in: ["DEPARTED", "IN_TRANSIT", "BOARDING"] },
        },
      }),
    ]);

    const delayedTrips = await prisma.trip.count({
      where: {
        scheduledDeparture: { gte: today, lt: tomorrow },
        delayMinutes: { gt: 10 },
      },
    });

    // Booking stats
    const todayBookings = await prisma.booking.count({
      where: {
        createdAt: { gte: today, lt: tomorrow },
        bookingStatus: { not: "CANCELLED" },
      },
    });

    // Revenue stats (last 30 days)
    const revenueData = await prisma.tripProfitability.aggregate({
      where: { calculatedAt: { gte: thirtyDaysAgo } },
      _sum: {
        ticketRevenue: true,
        totalRevenue: true,
        totalCost: true,
        contributionProfit: true,
        fuelCost: true,
        maintenanceCost: true,
        crewCost: true,
        commissions: true,
      },
      _avg: {
        occupancyPct: true,
        profitMarginPct: true,
      },
    });

    // Today's revenue (approximate)
    const todayRevenue = await prisma.bookingPayment.aggregate({
      where: {
        paidAt: { gte: today, lt: tomorrow },
        status: "PAID",
      },
      _sum: { amount: true },
    });

    // Unread alerts count
    const alertsCount = await prisma.alert.count({
      where: { isRead: false, isResolved: false },
    });

    // Open complaints
    const openComplaints = await prisma.complaint.count({
      where: { status: { in: ["OPEN", "ASSIGNED", "IN_PROGRESS"] } },
    });

    // Total customers
    const totalCustomers = await prisma.customer.count();

    // Today's operations table
    const todayOpsTrips = await prisma.trip.findMany({
      where: {
        scheduledDeparture: { gte: today, lt: tomorrow },
        status: { notIn: ["CANCELLED"] },
      },
      include: {
        route: true,
        vehicle: true,
        crew: {
          include: {
            driver: {
              include: { employee: true },
            },
          },
          where: { crewRole: "DRIVER" },
          take: 1,
        },
      },
      orderBy: { scheduledDeparture: "asc" },
      take: 20,
    });

    // Revenue by channel (last 30 days)
    const channelRevenue = await prisma.booking.groupBy({
      by: ["channel"],
      where: {
        createdAt: { gte: thirtyDaysAgo },
        bookingStatus: { not: "CANCELLED" },
      },
      _sum: { totalAmount: true, commissionAmount: true },
      _count: { id: true },
    });

    // Daily revenue trend (last 14 days)
    const revenueTrend: { date: string; revenue: number; bookings: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const dEnd = new Date(d);
      dEnd.setDate(dEnd.getDate() + 1);

      const dayBookings = await prisma.booking.aggregate({
        where: {
          createdAt: { gte: d, lt: dEnd },
          bookingStatus: { not: "CANCELLED" },
        },
        _sum: { totalAmount: true },
        _count: { id: true },
      });

      revenueTrend.push({
        date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        revenue: dayBookings._sum.totalAmount || 0,
        bookings: dayBookings._count.id,
      });
    }

    // Occupancy by route (last 30 days)
    const routeOccupancy = await prisma.tripProfitability.findMany({
      where: { calculatedAt: { gte: thirtyDaysAgo } },
      select: {
        trip: {
          select: {
            route: { select: { origin: true, destination: true } },
          },
        },
        occupancyPct: true,
        contributionProfit: true,
        ticketRevenue: true,
      },
      take: 200,
    });

    // Aggregate by route
    const routeMap: Record<string, { route: string; occupancy: number; profit: number; revenue: number; count: number }> = {};
    for (const rp of routeOccupancy) {
      const key = `${rp.trip.route.origin} → ${rp.trip.route.destination}`;
      if (!routeMap[key]) {
        routeMap[key] = { route: key, occupancy: 0, profit: 0, revenue: 0, count: 0 };
      }
      routeMap[key].occupancy += rp.occupancyPct;
      routeMap[key].profit += rp.contributionProfit;
      routeMap[key].revenue += rp.ticketRevenue;
      routeMap[key].count++;
    }
    const routeStats = Object.values(routeMap)
      .map((r) => ({
        route: r.route,
        avgOccupancy: r.count > 0 ? r.occupancy / r.count : 0,
        totalProfit: r.profit,
        totalRevenue: r.revenue,
      }))
      .sort((a, b) => b.totalProfit - a.totalProfit)
      .slice(0, 8);

    // AI insights
    const aiInsight = await prisma.aiInsight.findFirst({
      where: { type: "DAILY_BRIEF" },
      orderBy: { createdAt: "desc" },
    });

    // Recent alerts
    const recentAlerts = await prisma.alert.findMany({
      where: { isResolved: false },
      orderBy: [{ severity: "desc" }, { createdAt: "desc" }],
      take: 5,
    });

    return NextResponse.json({
      fleet: { totalBuses, activeBuses, maintenanceBuses, breakdownBuses, idleBuses },
      trips: { todayTrips, completedTrips, cancelledTrips, activeTrips, delayedTrips },
      bookings: { todayBookings },
      revenue: {
        last30Days: revenueData._sum.ticketRevenue || 0,
        netRevenue: revenueData._sum.totalRevenue || 0,
        totalCost: revenueData._sum.totalCost || 0,
        profit: revenueData._sum.contributionProfit || 0,
        fuelCost: revenueData._sum.fuelCost || 0,
        maintenanceCost: revenueData._sum.maintenanceCost || 0,
        crewCost: revenueData._sum.crewCost || 0,
        commissions: revenueData._sum.commissions || 0,
        avgOccupancy: revenueData._avg.occupancyPct || 0,
        avgProfitMargin: revenueData._avg.profitMarginPct || 0,
        todayRevenue: todayRevenue._sum.amount || 0,
      },
      alerts: alertsCount,
      complaints: openComplaints,
      customers: totalCustomers,
      todayOps: todayOpsTrips.map((t) => ({
        id: t.id,
        tripCode: t.tripCode,
        route: `${t.route.origin} → ${t.route.destination}`,
        busCode: t.vehicle.vehicleCode,
        busNumber: t.vehicle.vehicleNumber,
        driverName: t.crew[0]?.driver.employee.name || "Not Assigned",
        departure: t.scheduledDeparture,
        status: t.status,
        occupancyPct: t.occupancyPct,
        bookedSeats: t.bookedSeats,
        totalSeats: t.totalSeats,
        delayMinutes: t.delayMinutes,
        latitude: t.vehicle.latitude,
        longitude: t.vehicle.longitude,
      })),
      channelRevenue: channelRevenue.map((c) => ({
        channel: c.channel,
        bookings: c._count.id,
        revenue: c._sum.totalAmount || 0,
        commission: c._sum.commissionAmount || 0,
      })),
      revenueTrend,
      routeStats,
      aiInsight: aiInsight ? JSON.parse(aiInsight.content) : null,
      recentAlerts,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
