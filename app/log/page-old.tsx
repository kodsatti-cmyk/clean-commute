import CommuteForm from "@/components/CommuteForm";

export default async function LogPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const params = await searchParams;
  const preselectedLocation = params.location;

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-700 mb-2">
              Log Your Commute
            </h1>
            <p className="text-gray-600">
              Help track our sustainable commute impact
            </p>
          </div>

          <CommuteForm preselectedLocation={preselectedLocation} />

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              ← Back to home
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
