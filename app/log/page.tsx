import CommuteForm from "@/components/CommuteForm";
import { OFFICE_LOCATIONS } from "@/lib/seed";

export default async function LogPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const params = await searchParams;
  const selectedLocation = OFFICE_LOCATIONS.find(
    (location) => location.id === params.location
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Clean Commute Challenge
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                October 2026 • Ecologique India
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 sm:px-8 py-8 text-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  Log Your Commute
                </h2>
                <p className="text-emerald-100 text-sm sm:text-base">
                  Track your sustainable commute and see our collective impact
                </p>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="px-6 sm:px-8 py-8">
            {selectedLocation ? (
              <CommuteForm preselectedLocation={selectedLocation.id} />
            ) : (
              <div
                role="alert"
                className="rounded-lg border border-amber-300 bg-amber-50 p-5 text-center text-amber-900"
              >
                <p className="font-semibold">Location is missing</p>
                <p className="mt-1 text-sm">
                  Please scan the QR code again.
                </p>
              </div>
            )}
          </div>

          {/* Card Footer */}
          <div className="bg-gray-50 px-6 sm:px-8 py-6 border-t border-gray-100">
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <svg className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900 mb-1">Privacy Protected</p>
                <p className="text-gray-600 leading-relaxed">
                  We collect zero personal information. Only date, location, mode, and distance are recorded — completely anonymous.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
