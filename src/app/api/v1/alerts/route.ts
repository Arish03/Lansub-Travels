import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const alerts = await prisma.alert.findMany({
      take: 60,
      orderBy: { createdAt: "desc" },
    });

    const severityCounts = await prisma.alert.groupBy({
      by: ["severity"],
      _count: true,
    });

    return NextResponse.json({
      alerts,
      counts: severityCounts.reduce((acc, curr) => {
        acc[curr.severity] = curr._count;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error: any) {
    console.error("Alerts API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
