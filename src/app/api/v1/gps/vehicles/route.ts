import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all vehicles with current GPS data and active trip info
    const vehicles = await prisma.vehicle.findMany({
      where: { deletedAt: null },
      include: {
        trips: {
          where: {
            status: { in: ["DEPARTED", "IN_TRANSIT", "BOARDING", "ARRIVED"] },
            scheduledDeparture: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          },
          include: {
            route: true,
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
          orderBy: { scheduledDeparture: "desc" },
          take: 1,
        },
      },
    });

    const vehicleData = vehicles
      .filter((v) => v.latitude !== null && v.longitude !== null)
      .map((v) => {
        const activeTrip = v.trips[0];
        return {
          id: v.id,
          vehicleCode: v.vehicleCode,
          vehicleNumber: v.vehicleNumber,
          model: v.model,
          manufacturer: v.manufacturer,
          status: v.status,
          latitude: v.latitude,
          longitude: v.longitude,
          speed: v.speed,
          lastUpdate: v.lastGpsUpdate?.toISOString() || new Date().toISOString(),
          fuelLevel: v.fuelLevel,
          engineTemp: v.engineTemp,
          batteryVoltage: v.batteryVoltage,
          driverName: activeTrip?.crew[0]?.driver.employee.name,
          route: activeTrip ? `${activeTrip.route.origin} → ${activeTrip.route.destination}` : null,
          origin: activeTrip?.route.origin,
          destination: activeTrip?.route.destination,
          occupancyPct: activeTrip?.occupancyPct,
          bookedSeats: activeTrip?.bookedSeats,
          totalSeats: activeTrip?.totalSeats,
          tripStatus: activeTrip?.status,
          tripId: activeTrip?.id,
          delayMinutes: activeTrip?.delayMinutes,
          scheduledDeparture: activeTrip?.scheduledDeparture?.toISOString(),
        };
      });

    // Stats
    const statuses = vehicles.reduce((acc, v) => {
      acc[v.status] = (acc[v.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const todayRevenue = await prisma.bookingPayment.aggregate({
      where: {
        paidAt: { gte: today, lt: tomorrow },
        status: "PAID",
      },
      _sum: { amount: true },
    });

    const activeTripsCount = await prisma.trip.count({
      where: {
        status: { in: ["DEPARTED", "IN_TRANSIT", "BOARDING"] },
      },
    });

    const stats = {
      totalVehicles: vehicles.length,
      busesOnRoute: statuses.ACTIVE || 0,
      busesIdle: statuses.IDLE || 0,
      busesMaintenance: statuses.MAINTENANCE || 0,
      busesBreakdown: statuses.BREAKDOWN || 0,
      activeTrips: activeTripsCount,
      todayRevenue: todayRevenue._sum.amount || 0,
      avgOccupancy: vehicleData
        .filter((v) => v.occupancyPct)
        .reduce((sum, v) => sum + (v.occupancyPct || 0), 0) /
        (vehicleData.filter((v) => v.occupancyPct).length || 1),
      criticalAlerts: await prisma.alert.count({
        where: { severity: "CRITICAL", isResolved: false },
      }),
    };

    return NextResponse.json({ vehicles: vehicleData, stats });
  } catch (error) {
    console.error("GPS vehicles API error:", error);
    return NextResponse.json({ error: "Failed to fetch vehicle data" }, { status: 500 });
  }
}
