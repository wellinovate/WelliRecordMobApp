/**
 * WelliRecord Records Service
 * Manages clinical documents, lab panels, vitals, prescriptions, and cryptographic provenance.
 */

import { storage } from "../utils/storage"
import { CONFIG } from "./config"
import { offlineSyncService } from "./offlineSyncService"

export interface ClinicalRecord {
  id: string
  title: string
  date: string
  category: "lab" | "prescription" | "clinical_note" | "imaging" | "vitals"
  provider: string
  doctor?: string
  status: "verified" | "pending" | "critical"
  summary: string
  fileUrl?: string
  fileName?: string
}

const DEFAULT_RECORDS: ClinicalRecord[] = [
  {
    id: "rec_1",
    title: "Complete Blood Count & Haemoglobin",
    date: "14 May 2026",
    category: "lab",
    provider: "SYNLAB Nigeria - Victoria Island",
    doctor: "Dr. K. Bello",
    status: "verified",
    summary: "Haemoglobin 11.2 g/dL (Mild microcytic anaemia flagged). WBC 6.8 x10^9/L.",
  },
  {
    id: "rec_2",
    title: "Amlodipine 5mg Daily Prescription",
    date: "10 May 2026",
    category: "prescription",
    provider: "MedPlus Pharmacy Ikoyi",
    doctor: "Dr. O. Adebayo",
    status: "verified",
    summary: "Oral tablet once daily for blood pressure management. 28 days supply.",
  },
  {
    id: "rec_3",
    title: "Annual Cardiology Health Assessment",
    date: "28 April 2026",
    category: "clinical_note",
    provider: "Lagoon Hospital Lekki",
    doctor: "Dr. O. Adebayo",
    status: "verified",
    summary: "Resting BP 124/82 mmHg. Normal heart sounds. ECG shows sinus rhythm.",
  },
  {
    id: "rec_4",
    title: "Chest X-Ray (PA View)",
    date: "12 Jan 2026",
    category: "imaging",
    provider: "Evercare Hospital Lekki",
    doctor: "Dr. N. Eze",
    status: "verified",
    summary: "Normal cardiothoracic ratio. Clear lung fields. No acute consolidation.",
  },
]

export const recordsService = {
  async getRecords(): Promise<ClinicalRecord[]> {
    const raw = await storage.getItem(CONFIG.offlineKey)
    if (!raw) {
      await storage.setItem(CONFIG.offlineKey, JSON.stringify(DEFAULT_RECORDS))
      return DEFAULT_RECORDS
    }
    try {
      return JSON.parse(raw)
    } catch {
      return DEFAULT_RECORDS
    }
  },

  async addRecord(record: Omit<ClinicalRecord, "id">): Promise<ClinicalRecord> {
    const newRecord: ClinicalRecord = {
      ...record,
      id: `rec_${Date.now()}`,
    }

    const current = await this.getRecords()
    const updated = [newRecord, ...current]
    await storage.setItem(CONFIG.offlineKey, JSON.stringify(updated))

    if (!offlineSyncService.isOnline()) {
      await offlineSyncService.enqueue("CREATE_RECORD", newRecord)
    }

    return newRecord
  },

  async deleteRecord(recordId: string): Promise<void> {
    const current = await this.getRecords()
    const updated = current.filter((r) => r.id !== recordId)
    await storage.setItem(CONFIG.offlineKey, JSON.stringify(updated))

    if (!offlineSyncService.isOnline()) {
      await offlineSyncService.enqueue("DELETE_RECORD", { recordId })
    }
  },
}
