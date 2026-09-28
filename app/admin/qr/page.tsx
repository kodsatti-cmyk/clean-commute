import QRGenerator from "@/components/QRGenerator";
import { OFFICE_LOCATIONS } from "@/lib/seed";

export default function QRPage() {
  // Generate base URL (will be replaced with actual deployed URL)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            QR Code Generator
          </h1>
          <p className="text-gray-600">
            Generate and print QR codes for each office location
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Important:</strong> After deploying to Vercel, update
                the <code>NEXT_PUBLIC_BASE_URL</code> environment variable with
                your production URL, then regenerate these QR codes.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Instructions
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "Download" on each QR code below</li>
            <li>Print the QR codes (preferably on A4 or Letter size paper)</li>
            <li>Post them prominently at each office location</li>
            <li>
              Employees scan the QR code to quickly access the commute logging
              form
            </li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {OFFICE_LOCATIONS.map((location) => {
            const url = `${baseUrl}/log?location=${location.id}`;
            return (
              <QRGenerator
                key={location.id}
                url={url}
                location={location}
              />
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
