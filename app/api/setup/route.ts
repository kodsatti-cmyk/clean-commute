import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Check if table already exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'commute_entries'
      );
    `;

    const tableExists = tableCheck.rows[0]?.exists;

    if (tableExists) {
      return NextResponse.json(
        { message: "Database already initialized" },
        { status: 200 }
      );
    }

    // Create the commute_entries table
    await sql`
      CREATE TABLE commute_entries (
        id SERIAL PRIMARY KEY,
        logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        office_location VARCHAR(50) NOT NULL,
        travel_mode VARCHAR(30) NOT NULL,
        kilometers DECIMAL(5,2) NOT NULL
      );
    `;

    // Create indexes
    await sql`
      CREATE INDEX idx_logged_at ON commute_entries(logged_at);
    `;

    await sql`
      CREATE INDEX idx_office_location ON commute_entries(office_location);
    `;

    return NextResponse.json(
      { message: "Database initialized successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database setup error:", error);
    return NextResponse.json(
      { error: "Failed to initialize database" },
      { status: 500 }
    );
  }
}
