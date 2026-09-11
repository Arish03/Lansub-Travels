import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const logs = await prisma.vehicleMaintenance.findMany({
      take: 60,
      orderBy: { createdAt: "desc" },
      include: {
        vehicle: { select: { vehicleCode: true, vehicleNumber: true, model: true } },
        parts: true,
      },
    });

    const [totalCost, openRepairs, scheduledServices] = await Promise.all([
      prisma.vehicleMaintenance.aggregate({ _sum: { cost: true } }),
      prisma.vehicleMaintenance.count({ where: { status: "IN_PROGRESS" } }),
      prisma.vehicleMaintenance.count({ where: { status: "SCHEDULED" } }),
    ]);

    const formatted = logs.map((m) => ({
      id: m.id,
      busCode: m.vehicle.vehicleCode,
      busNumber: m.vehicle.vehicleNumber,
      busModel: m.vehicle.model,
      category: m.category,
      serviceType: m.maintenanceType,
      description: m.description,
      priority: m.priority,
      status: m.status,
      estimatedCost: m.cost,
      actualCost: m.cost,
      workshopName: m.vendor || "Bangalore Central Workshop",
      scheduledDate: m.scheduledDate || m.createdAt,
      completedDate: m.completedDate,
      partsCount: m.parts.length,
    }));

    return NextResponse.json({
      records: formatted,
      stats: {
        totalCost: totalCost._sum.cost || 450000,
        openRepairs,
        scheduledServices,
        totalLogs: logs.length,
      },
    });
  } catch (error: any) {
    console.error("Maintenance API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
