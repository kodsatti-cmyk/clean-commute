"use client";

import { useState } from "react";
import { OFFICE_LOCATIONS, TRAVEL_MODES } from "@/lib/seed";

interface CommuteFormProps {
  preselectedLocation?: string;
}

export default function CommuteForm({ preselectedLocation }: CommuteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    office_location: preselectedLocation || "",
    travel_mode: "",
    kilometers: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          office_location: formData.office_location,
          travel_mode: formData.travel_mode,
          kilometers: parseFloat(formData.kilometers),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to log entry");
      }

      setSuccess(true);
      
      // Reset form (keep location if pre-selected)
      setFormData({
        office_location: preselectedLocation || "",
        travel_mode: "",
        kilometers: "",
      });

      // Hide success message after 4 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get location name for display
  const getLocationName = (id: string) => {
    return OFFICE_LOCATIONS.find(loc => loc.id === id)?.name || id;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success message */}
      {success && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-md shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-emerald-800">
                Commute logged successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Office Location */}
      <div>
        <label
          htmlFor="office_location"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Office Location
        </label>
        {preselectedLocation ? (
          <div className="relative">
            <input
              type="text"
              value={getLocationName(preselectedLocation)}
              disabled
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-medium cursor-not-allowed"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        ) : (
          <select
            id="office_location"
            required
            value={formData.office_location}
            onChange={(e) =>
              setFormData({ ...formData, office_location: e.target.value })
            }
            className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base shadow-sm transition-all hover:border-gray-400"
          >
            <option value="">Select your office</option>
            {OFFICE_LOCATIONS.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        )}
        {preselectedLocation && (
          <p className="mt-2 text-sm text-gray-600">
            📍 Location set from QR code
          </p>
        )}
      </div>

      {/* Travel Mode */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Travel Mode
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TRAVEL_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() =>
                setFormData({ ...formData, travel_mode: mode.id })
              }
              className={`group relative flex flex-col items-center justify-center p-5 border-2 rounded-xl transition-all duration-200 ${
                formData.travel_mode === mode.id
                  ? "border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200"
                  : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm"
              }`}
            >
              <span className="text-4xl mb-2 transition-transform group-hover:scale-110">
                {mode.icon}
              </span>
              <span className={`text-sm font-medium text-center transition-colors ${
                formData.travel_mode === mode.id
                  ? "text-emerald-700"
                  : "text-gray-700"
              }`}>
                {mode.name}
              </span>
              {formData.travel_mode === mode.id && (
                <div className="absolute top-2 right-2">
                  <svg className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Kilometers */}
      <div>
        <label
          htmlFor="kilometers"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Distance (kilometers)
        </label>
        <div className="relative">
          <input
            id="kilometers"
            type="number"
            step="0.1"
            min="0.1"
            max="999.9"
            required
            value={formData.kilometers}
            onChange={(e) =>
              setFormData({ ...formData, kilometers: e.target.value })
            }
            placeholder="e.g., 15.5"
            className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base shadow-sm transition-all hover:border-gray-400"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500 text-sm font-medium">km</span>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Enter the one-way distance of your commute
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-lg font-semibold text-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Logging...
          </span>
        ) : (
          "Log Commute"
        )}
      </button>
    </form>
  );
}
