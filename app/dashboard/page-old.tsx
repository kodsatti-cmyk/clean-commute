import StatsCard from "@/components/StatsCard";
import ModeChart from "@/components/ModeChart";
import { TRAVEL_MODES } from "@/lib/seed";

async function getStats() {
  try {
    // Use Vercel URL in production, localhost in development
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/stats`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch stats");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  if (!stats) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Unable to load statistics</p>
          </div>
        </div>
      </main>
    );
  }

  const hasData = stats.totals.entries > 0;

  // Map mode IDs to display names with icons
  const modesWithNames = stats.byMode.map((mode: any) => {
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Clean Commute Challenge - October 2026
          </p>
        </div>

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
                      {stats.byLocation.map((location: any) => (
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
              <a
                href="/log"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center"
              >
                Log Another Commute
              </a>
              <a
                href="/"
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-center"
              >
                Back to Home
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
