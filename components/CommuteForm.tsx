"use client";

import { useEffect, useRef, useState } from "react";
import { OFFICE_LOCATIONS, TRAVEL_MODES } from "@/lib/seed";

interface CommuteFormProps {
  preselectedLocation?: string;
}

export default function CommuteForm({ preselectedLocation }: CommuteFormProps) {
  const successMessageRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) return;

    successMessageRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
    });
  }, [success]);

  const [formData, setFormData] = useState({
    office_location: preselectedLocation || "",
    travel_mode: "",
    kilometers: "",
  });

  // Form validation
  const isFormValid =
    formData.office_location &&
    formData.travel_mode &&
    formData.kilometers &&
    parseFloat(formData.kilometers) > 0 &&
    parseFloat(formData.kilometers) <= 70;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

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

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle distance input with validation
  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty or valid decimal numbers up to 70 km.
    if (value === '' || (/^\d+(\.\d{0,1})?$/.test(value) && parseFloat(value) <= 70)) {
      setFormData({ ...formData, kilometers: value });
    }
  };

  // Handle mode selection with keyboard
  const handleModeKeyDown = (e: React.KeyboardEvent, modeId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFormData({ ...formData, travel_mode: modeId });
    }
  };

  // Get location name for display
  const getLocationName = (id: string) => {
    return OFFICE_LOCATIONS.find(loc => loc.id === id)?.name || id;
  };

  // Validate distance for warnings
  const distanceWarning = formData.kilometers && parseFloat(formData.kilometers) > 100
    ? "That's a long commute! Double-check the distance."
    : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success message */}
      {success && (
        <div
          ref={successMessageRef}
          role="status"
          aria-live="polite"
          className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-md shadow-sm animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-emerald-800 flex-1">
              Commute logged successfully!
            </p>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="flex-shrink-0 text-emerald-600 hover:text-emerald-800 transition-colors p-1 rounded-md hover:bg-emerald-100"
              aria-label="Dismiss success message"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
            <button
              type="button"
              onClick={() => setError(null)}
              className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors p-1 rounded-md hover:bg-red-100"
              aria-label="Dismiss error message"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
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
        <div className="relative">
          <input
            type="text"
            value={preselectedLocation ? getLocationName(preselectedLocation) : ""}
            disabled
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-medium cursor-not-allowed"
            aria-label="Office location set from QR code"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          📍 Location set from QR code
        </p>
      </div>

      {/* Travel Mode */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Travel Mode
        </label>
        <div
          className="grid grid-cols-2 lg:grid-cols-5 gap-3"
          role="radiogroup"
          aria-label="Select travel mode"
        >
          {TRAVEL_MODES.map((mode, index) => (
            <button
              key={mode.id}
              type="button"
              role="radio"
              aria-checked={formData.travel_mode === mode.id}
              tabIndex={formData.travel_mode === mode.id ? 0 : -1}
              onClick={() => setFormData({ ...formData, travel_mode: mode.id })}
              onKeyDown={(e) => handleModeKeyDown(e, mode.id)}
              className={`group relative flex flex-col items-center justify-center p-5 border-2 rounded-xl transition-all duration-200 min-h-[110px] ${
                formData.travel_mode === mode.id
                  ? "border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200"
                  : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              }`}
            >
              <span className="text-4xl mb-2 transition-transform group-hover:scale-110" aria-hidden="true">
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
                <div className="absolute top-2 right-2" aria-hidden="true">
                  <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
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
            min="0"
            max="70"
            required
            value={formData.kilometers}
            onChange={handleDistanceChange}
            placeholder="e.g., 15.5"
            className={`w-full px-4 py-3.5 pr-12 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base shadow-sm transition-all hover:border-gray-400 ${
              formData.kilometers && parseFloat(formData.kilometers) > 0
                ? "border-emerald-300"
                : "border-gray-300"
            }`}
            aria-describedby="distance-hint"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none gap-2">
            {formData.kilometers && parseFloat(formData.kilometers) > 0 && (
              <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-gray-500 text-sm font-medium">km</span>
          </div>
        </div>
        <div className="mt-3">
          <input
            type="range"
            min="0"
            max="70"
            step="0.1"
            value={formData.kilometers || "0"}
            onChange={(e) =>
              setFormData({ ...formData, kilometers: e.target.value })
            }
            aria-label="Distance in kilometers slider"
            className="w-full accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0 km</span>
            <span>70 km</span>
          </div>
        </div>
        <div className="mt-2 space-y-1">
          <p id="distance-hint" className="text-sm text-gray-600">
            Enter the one-way distance of your commute
          </p>
          {distanceWarning && (
            <p className="text-sm text-amber-600 flex items-center gap-1">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {distanceWarning}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !isFormValid}
        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-lg font-semibold text-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label={isSubmitting ? "Logging commute..." : "Log commute"}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
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
