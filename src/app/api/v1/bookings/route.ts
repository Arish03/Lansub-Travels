import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const channel = searchParams.get("channel");
    const status = searchParams.get("status");

    const where: any = {};
    if (channel && channel !== "ALL") where.channel = channel;
    if (status && status !== "ALL") where.bookingStatus = status;

    const [bookings, totalCount, channelStats] = await Promise.all([
      prisma.booking.findMany({
        where,
        take: 100,
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { name: true, phone: true, email: true } },
          trip: {
            include: {
              route: { select: { origin: true, destination: true } },
              vehicle: { select: { vehicleCode: true } },
            },
          },
          seat: { select: { seatNumber: true } },
        },
      }),
      prisma.booking.count(),
      prisma.booking.groupBy({
        by: ["channel"],
        _count: true,
        _sum: { totalAmount: true },
      }),
    ]);

    const formatted = bookings.map((b) => ({
      id: b.id,
      pnr: b.bookingRef,
      channel: b.channel,
      customerName: b.passengerName || b.customer?.name || "Passenger",
      customerPhone: b.passengerPhone || b.customer?.phone || "—",
      customerEmail: b.customer?.email || "—",
      route: `${b.trip.route.origin} → ${b.trip.route.destination}`,
      busCode: b.trip.vehicle.vehicleCode,
      seats: b.seat?.seatNumber || "Seat Assigned",
      passengerCount: 1,
      amount: b.totalAmount,
      bookingStatus: b.bookingStatus,
      paymentStatus: b.paymentStatus,
      date: b.createdAt,
      departure: b.trip.scheduledDeparture,
    }));

    return NextResponse.json({
      bookings: formatted,
      totalCount,
      channelStats: channelStats.map((c) => ({
        channel: c.channel,
        count: c._count,
        revenue: c._sum.totalAmount || 0,
      })),
    });
  } catch (error: any) {
    console.error("Bookings API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
