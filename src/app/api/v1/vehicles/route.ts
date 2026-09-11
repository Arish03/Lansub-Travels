import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { deletedAt: null },
      include: {
        _count: {
          select: {
            trips: true,
            maintenance: true,
            alerts: true,
          },
        },
        maintenance: {
          where: {
            status: { in: ["SCHEDULED", "OVERDUE"] },
          },
          orderBy: { nextDueDate: "asc" },
          take: 1,
          select: {
            category: true,
            nextDueDate: true,
            priority: true,
          },
        },
        documents: {
          where: {
            expiryDate: {
              gte: new Date(),
              lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            isActive: true,
          },
        },
      },
      orderBy: [{ status: "asc" }, { vehicleCode: "asc" }],
    });

    const vehicleData = vehicles.map((v) => ({
      id: v.id,
      vehicleCode: v.vehicleCode,
      vehicleNumber: v.vehicleNumber,
      model: v.model,
      manufacturer: v.manufacturer,
      year: v.year,
      color: v.color,
      fuelType: v.fuelType,
      seatingCapacity: v.seatingCapacity,
      status: v.status,
      odometer: v.odometer,
      purchasePrice: v.purchasePrice,
      currentValue: v.currentValue,
      purchaseDate: v.purchaseDate,
      latitude: v.latitude,
      longitude: v.longitude,
      speed: v.speed,
      fuelLevel: v.fuelLevel,
      engineTemp: v.engineTemp,
      batteryVoltage: v.batteryVoltage,
      lastGpsUpdate: v.lastGpsUpdate,
      _count: v._count,
      nextMaintenance: v.maintenance[0] || null,
      docsExpiringSoon: v.documents.length,
    }));

    // Summary stats
    const summary = {
      total: vehicles.length,
      active: vehicles.filter((v) => v.status === "ACTIVE").length,
      idle: vehicles.filter((v) => v.status === "IDLE").length,
      maintenance: vehicles.filter((v) => v.status === "MAINTENANCE").length,
      breakdown: vehicles.filter((v) => v.status === "BREAKDOWN").length,
      retired: vehicles.filter((v) => v.status === "RETIRED").length,
      lowFuel: vehicles.filter((v) => v.fuelLevel !== null && v.fuelLevel < 25).length,
      highTemp: vehicles.filter((v) => v.engineTemp !== null && v.engineTemp > 100).length,
    };

    return NextResponse.json({ vehicles: vehicleData, summary });
  } catch (error) {
    console.error("Vehicles API error:", error);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}
