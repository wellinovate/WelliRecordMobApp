/**
 * WelliRecord Care & Facility Service
 * Handles clinic discovery, doctor appointments, check-ins, and visit preparation.
 */

export interface Facility {
  id: string
  name: string
  type: "hospital" | "diagnostic" | "pharmacy"
  location: string
  distanceKm: number
  availableSlots: string[]
}

export const FACILITIES: Facility[] = [
  {
    id: "fac_1",
    name: "Lagoon Hospital Lekki",
    type: "hospital",
    location: "Plot 22 Admiralty Way, Lekki Phase 1, Lagos",
    distanceKm: 2.4,
    availableSlots: ["09:00 AM", "11:30 AM", "02:00 PM", "04:15 PM"],
  },
  {
    id: "fac_2",
    name: "SYNLAB Diagnostic Laboratories",
    type: "diagnostic",
    location: "Victoria Island, Lagos",
    distanceKm: 4.1,
    availableSlots: ["08:00 AM", "10:00 AM", "01:30 PM"],
  },
  {
    id: "fac_3",
    name: "MedPlus Pharmacy & Wellness",
    type: "pharmacy",
    location: "Awolowo Road, Ikoyi, Lagos",
    distanceKm: 5.0,
    availableSlots: ["All Day Walk-in"],
  },
]

export const careService = {
  getNearbyFacilities(): Facility[] {
    return FACILITIES
  },
}
