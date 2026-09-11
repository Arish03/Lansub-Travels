import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({
      take: 100,
      include: {
        employee: {
          select: {
            id: true,
            employeeCode: true,
            name: true,
            phone: true,
            email: true,
            status: true,
            city: true,
          },
        },
        _count: { select: { tripCrews: true } },
      },
    });

    const formatted = drivers.map((d) => ({
      id: d.id,
      name: d.employee.name,
      employeeCode: d.employee.employeeCode,
      phone: d.employee.phone,
      email: d.employee.email,
      branch: d.employee.city || "Bangalore HQ",
      licenseNumber: d.licenceNumber,
      licenseType: d.licenceType,
      licenseExpiry: d.licenceExpiry,
      safetyScore: d.safetyScore,
      experienceYears: d.experience,
      dutyStatus: d.status,
      totalTrips: d._count.tripCrews,
    }));

    return NextResponse.json({ drivers: formatted });
  } catch (error: any) {
    console.error("Drivers API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
