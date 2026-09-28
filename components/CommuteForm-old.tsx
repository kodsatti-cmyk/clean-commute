"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OFFICE_LOCATIONS, TRAVEL_MODES } from "@/lib/seed";

interface CommuteFormProps {
  preselectedLocation?: string;
}

export default function CommuteForm({ preselectedLocation }: CommuteFormProps) {
  const router = useRouter();
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
      
      // Reset form
      setFormData({
        office_location: preselectedLocation || "",
        travel_mode: "",
        kilometers: "",
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          ✅ Commute logged successfully!
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          ❌ {error}
        </div>
      )}

      {/* Office Location */}
      <div>
        <label
          htmlFor="office_location"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Office Location
        </label>
        <select
          id="office_location"
          required
          value={formData.office_location}
          onChange={(e) =>
            setFormData({ ...formData, office_location: e.target.value })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
        >
          <option value="">Select your office</option>
          {OFFICE_LOCATIONS.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      {/* Travel Mode */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Travel Mode
        </label>
        <div className="grid grid-cols-2 gap-3">
          {TRAVEL_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() =>
                setFormData({ ...formData, travel_mode: mode.id })
              }
              className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                formData.travel_mode === mode.id
                  ? "border-green-500 bg-green-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-3xl mb-2">{mode.icon}</span>
              <span className="text-sm font-medium text-gray-700">
                {mode.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Kilometers */}
      <div>
        <label
          htmlFor="kilometers"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Distance (km)
        </label>
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Logging..." : "Log Commute"}
      </button>
    </form>
  );
}
