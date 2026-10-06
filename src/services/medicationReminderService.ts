/**
 * WelliRecord Medication Reminder & Adherence Service
 */

import { storage } from "../utils/storage"
import { CONFIG } from "./config"

export interface MedicationItem {
  id: string
  name: string
  dosage: string
  frequency: string
  time: string
  instructions: string
  takenToday: boolean
  remainingDays: number
}

const DEFAULT_MEDICATIONS: MedicationItem[] = [
  {
    id: "med_1",
    name: "Amlodipine Besylate",
    dosage: "5mg",
    frequency: "Once daily",
    time: "08:00 AM",
    instructions: "Take with or without food in the morning",
    takenToday: true,
    remainingDays: 18,
  },
  {
    id: "med_2",
    name: "Ferrous Sulfate",
    dosage: "200mg",
    frequency: "Twice daily",
    time: "08:00 PM",
    instructions: "Take with water or citrus juice. Avoid dairy within 2 hours.",
    takenToday: false,
    remainingDays: 12,
  },
]

export const medicationReminderService = {
  async getMedications(): Promise<MedicationItem[]> {
    const raw = await storage.getItem(CONFIG.medicationsKey)
    if (!raw) {
      await storage.setItem(CONFIG.medicationsKey, JSON.stringify(DEFAULT_MEDICATIONS))
      return DEFAULT_MEDICATIONS
    }
    try {
      return JSON.parse(raw)
    } catch {
      return DEFAULT_MEDICATIONS
    }
  },

  async toggleTaken(id: string): Promise<MedicationItem[]> {
    const meds = await this.getMedications()
    const updated = meds.map((m) =>
      m.id === id ? { ...m, takenToday: !m.takenToday } : m
    )
    await storage.setItem(CONFIG.medicationsKey, JSON.stringify(updated))
    return updated
  },

  async addMedication(med: Omit<MedicationItem, "id" | "takenToday">): Promise<MedicationItem> {
    const meds = await this.getMedications()
    const newMed: MedicationItem = {
      ...med,
      id: `med_${Date.now()}`,
      takenToday: false,
    }
    const updated = [...meds, newMed]
    await storage.setItem(CONFIG.medicationsKey, JSON.stringify(updated))
    return newMed
  },
}
