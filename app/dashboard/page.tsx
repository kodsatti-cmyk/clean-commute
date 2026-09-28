"use client";

import { useEffect, useState } from "react";
import StatsCard from "@/components/StatsCard";
import ModeChart from "@/components/ModeChart";
import { TRAVEL_MODES } from "@/lib/seed";

interface Stats {
  totals: {
    entries: number;
    kilometers: number;
  };
  byMode: Array<{
    travel_mode: string;
    count: string;
    total_km: string;
    percentage: string;
  }>;
  byLocation: Array<{
    office_location: string;
    count: string;
    total_km: string;
  }>;
  daily: Array<{
    date: string;
    count: string;
    total_km: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch("/api/dashboard/login", { method: "DELETE" });
    window.location.replace("/dashboard/login");
  };

  useEffect(() => {
    async function fetchStats() {
      try {
        console.log("[Dashboard] Starting to fetch stats...");
        const response = await fetch("/api/stats", {
          cache: "no-store",
        });

        console.log("[Dashboard] Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("[Dashboard] Response not OK:", errorText);
          throw new Error(`Failed to fetch stats: ${response.status}`);
        }

        const data = await response.json();
        console.log("[Dashboard] Data received:", data);
        setStats(data);
        console.log("[Dashboard] Stats state updated");
      } catch (err) {
        console.error("[Dashboard] Error fetching stats:", err);
        setError(err instanceof Error ? err.message : "Unable to load statistics");
      } finally {
        setLoading(false);
        console.log("[Dashboard] Loading complete");
      }
    }

    fetchStats();
  }, []);

  const dashboardHeader = (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Clean Commute Challenge - October 2026
        </p>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-wait disabled:opacity-60"
      >
        {isLoggingOut ? "Logging out..." : "Log out"}
      </button>
    </div>
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {dashboardHeader}
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Loading statistics...
            </h2>
          </div>
        </div>
      </main>
    );
  }

  if (error || !stats) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {dashboardHeader}
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              {error || "Unable to load statistics"}
            </h2>
            <p className="text-gray-600 mb-6">
              Please try refreshing the page or contact support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </main>
    );
  }

  const hasData = stats.totals.entries > 0;

  // Map mode IDs to display names with icons
  const modesWithNames = stats.byMode.map((mode) => {
    const modeInfo = TRAVEL_MODES.find((m) => m.id === mode.travel_mode);
    return {
      ...mode,
      name: modeInfo?.name || mode.travel_mode,
      icon: modeInfo?.icon || "📊",
    };
  });

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {dashboardHeader}

        {!hasData ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No Data Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start logging your commutes to see statistics here!
            </p>
            <a
              href="/log"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Log Your First Commute
            </a>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <StatsCard
                title="Total Entries"
                value={stats.totals.entries.toLocaleString()}
                icon="📝"
                color="blue"
              />
              <StatsCard
                title="Total Kilometers"
                value={stats.totals.kilometers.toLocaleString()}
                icon="🛣️"
                color="green"
              />
            </div>

            {/* Mode Breakdown Chart */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Travel Mode Breakdown
              </h2>
              <ModeChart data={modesWithNames} />
            </div>

            {/* Location Breakdown Table */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                By Office Location
              </h2>
              {stats.byLocation.length === 0 ? (
                <p className="text-gray-500">No location data yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Location
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                          Entries
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                          Total KM
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stats.byLocation.map((location) => (
                        <tr key={location.office_location}>
                          <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                            {location.office_location.replace(/-/g, " ")}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-right">
                            {parseInt(location.count).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-right">
                            {parseFloat(location.total_km).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/api/export"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-center"
                download
              >
                📥 Export CSV
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
