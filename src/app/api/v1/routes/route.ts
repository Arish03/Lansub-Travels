import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const routes = await prisma.route.findMany({
      where: { isActive: true },
      include: {
        stops: { orderBy: { sequence: "asc" } },
        _count: { select: { trips: true } },
      },
    });

    const formatted = routes.map((r) => ({
      id: r.id,
      routeCode: r.routeCode,
      name: `${r.origin} → ${r.destination}`,
      origin: r.origin,
      destination: r.destination,
      distance: r.distance,
      duration: r.duration,
      baseFare: Math.round(r.distance * 2.2),
      totalTrips: r._count.trips,
      stopsCount: r.stops.length,
      stops: r.stops.map((s) => ({ name: s.stopName, order: s.sequence, km: Math.round(r.distance * (s.sequence / (r.stops.length || 1))) })),
    }));

    return NextResponse.json({ routes: formatted });
  } catch (error: any) {
    console.error("Routes API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
