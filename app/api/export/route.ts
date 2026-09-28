import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all entries ordered by date
    const result = await sql`
      SELECT 
        logged_at,
        office_location,
        travel_mode,
        kilometers
      FROM commute_entries
      ORDER BY logged_at DESC;
    `;

    // Create CSV header
    const headers = ["Date", "Time", "Office Location", "Travel Mode", "Kilometers"];
    const csvRows = [headers.join(",")];

    // Add data rows
    for (const row of result.rows) {
      const date = new Date(row.logged_at);
      const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const timeStr = date.toTimeString().split(" ")[0]; // HH:MM:SS
      
      const values = [
        dateStr,
        timeStr,
        row.office_location.replace(/,/g, " "), // Remove commas to prevent CSV issues
        row.travel_mode.replace(/,/g, " "),
        row.kilometers,
      ];
      
      csvRows.push(values.join(","));
    }

    const csvContent = csvRows.join("\n");

    // Return CSV with appropriate headers
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="commute-data-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("CSV export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
