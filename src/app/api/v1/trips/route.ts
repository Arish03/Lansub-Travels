import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const trips = await prisma.trip.findMany({
      where,
      take: 60,
      orderBy: { scheduledDeparture: "desc" },
      include: {
        route: {
          select: {
            routeCode: true,
            origin: true,
            destination: true,
            distance: true,
            duration: true,
            tollCost: true,
          },
        },
        vehicle: {
          select: {
            vehicleCode: true,
            vehicleNumber: true,
            model: true,
            seatingCapacity: true,
          },
        },
        crew: {
          include: {
            driver: {
              include: {
                employee: {
                  select: { name: true, phone: true },
                },
              },
            },
          },
        },
      },
    });

    const formatted = trips.map((t) => {
      const driver = t.crew[0]?.driver?.employee;
      const driverName = driver?.name || "Assigned Pilot";
      const baseFare = Math.round(t.route.distance * 2.2);
      return {
        id: t.id,
        tripCode: t.tripCode,
        route: `${t.route.origin} → ${t.route.destination}`,
        origin: t.route.origin,
        destination: t.route.destination,
        busCode: t.vehicle.vehicleCode,
        busNumber: t.vehicle.vehicleNumber,
        busModel: t.vehicle.model,
        totalSeats: t.totalSeats,
        bookedSeats: t.bookedSeats,
        occupancyPct: t.occupancyPct,
        departure: t.scheduledDeparture,
        arrival: t.scheduledArrival,
        status: t.status,
        delayMinutes: t.delayMinutes,
        driverName,
        fare: baseFare,
        revenue: Math.round(t.bookedSeats * baseFare),
      };
    });

    return NextResponse.json({ trips: formatted });
  } catch (error: any) {
    console.error("Trips API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
