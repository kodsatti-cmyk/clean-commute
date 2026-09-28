// Office locations for the Clean Commute Challenge
export const OFFICE_LOCATIONS = [
  { id: "bangalore-office", name: "Bangalore Office" },
  { id: "chennai-office", name: "Chennai Office" },
  { id: "gurgaon-office", name: "Gurgaon Office" },
  { id: "kochi-office", name: "Kochi Office" },
  { id: "kolkata-office", name: "Kolkata Office" },
  { id: "mumbai-office", name: "Mumbai Office" },
  { id: "delhi-office", name: "Delhi Office" },
  { id: "noida-office", name: "Noida Office" },
  { id: "pune-office", name: "Pune Office" },
  { id: "hyderabad-office", name: "Hyderabad Office" },
] as const;

export type OfficeLocationId = typeof OFFICE_LOCATIONS[number]["id"];

// Travel modes for commute logging
export const TRAVEL_MODES = [
  { id: "walk", name: "Walk", icon: "🚶" },
  { id: "bike", name: "Bike", icon: "🚲" },
  { id: "public-transport", name: "Public Transport", icon: "🚌" },
  { id: "carpool", name: "Carpool", icon: "🚗" },
  { id: "office-cab", name: "Office Cab", icon: "🚕" },
  { id: "electric-vehicle", name: "Electric Vehicle", icon: "⚡" },
] as const;

export type TravelModeId = typeof TRAVEL_MODES[number]["id"];
