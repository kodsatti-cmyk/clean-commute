import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Total entries and kilometers
    const totals = await sql`
      SELECT 
        COUNT(*) as total_entries,
        COALESCE(SUM(kilometers), 0) as total_kilometers
      FROM commute_entries;
    `;

    // Breakdown by travel mode
    const modeBreakdown = await sql`
      SELECT 
        travel_mode,
        COUNT(*) as count,
        COALESCE(SUM(kilometers), 0) as total_km
      FROM commute_entries
      GROUP BY travel_mode
      ORDER BY count DESC;
    `;

    // Breakdown by office location
    const locationBreakdown = await sql`
      SELECT 
        office_location,
        COUNT(*) as count,
        COALESCE(SUM(kilometers), 0) as total_km
      FROM commute_entries
      GROUP BY office_location
      ORDER BY count DESC;
    `;

    // Entries by day (last 30 days)
    const dailyEntries = await sql`
      SELECT 
        DATE(logged_at) as date,
        COUNT(*) as count,
        COALESCE(SUM(kilometers), 0) as total_km
      FROM commute_entries
      WHERE logged_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(logged_at)
      ORDER BY date DESC;
    `;

    const totalCount = parseInt(totals.rows[0]?.total_entries || "0");
    
    // Calculate percentages for modes
    const modesWithPercentage = modeBreakdown.rows.map((mode) => ({
      ...mode,
      percentage: totalCount > 0 
        ? ((parseInt(mode.count) / totalCount) * 100).toFixed(1)
        : "0.0",
    }));

    return NextResponse.json({
      totals: {
        entries: totalCount,
        kilometers: parseFloat(totals.rows[0]?.total_kilometers || "0"),
      },
      byMode: modesWithPercentage,
      byLocation: locationBreakdown.rows,
      daily: dailyEntries.rows,
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
