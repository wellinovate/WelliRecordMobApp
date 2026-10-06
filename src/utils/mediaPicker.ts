/**
 * Universal Camera & Document Picker for WelliRecord
 * Enables taking photos of medical slips, lab results, prescriptions, and picking files.
 */

export interface PickedMediaResult {
  uri: string
  name: string
  size?: number
  type?: string
}

export async function pickImageFromCamera(): Promise<PickedMediaResult | null> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      return resolve(null)
    }

    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.capture = "environment"
    input.style.display = "none"

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target?.files?.[0]
      if (file) {
        const url = URL.createObjectURL(file)
        resolve({
          uri: url,
          name: file.name,
          size: file.size,
          type: file.type,
        })
      } else {
        resolve(null)
      }
      document.body.removeChild(input)
    }

    document.body.appendChild(input)
    input.click()
  })
}

export async function pickImageFromLibrary(): Promise<PickedMediaResult | null> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      return resolve(null)
    }

    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.style.display = "none"

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target?.files?.[0]
      if (file) {
        const url = URL.createObjectURL(file)
        resolve({
          uri: url,
          name: file.name,
          size: file.size,
          type: file.type,
        })
      } else {
        resolve(null)
      }
      document.body.removeChild(input)
    }

    document.body.appendChild(input)
    input.click()
  })
}

export async function pickDocument(): Promise<PickedMediaResult | null> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      return resolve(null)
    }

    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf,image/*,.doc,.docx"
    input.style.display = "none"

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target?.files?.[0]
      if (file) {
        const url = URL.createObjectURL(file)
        resolve({
          uri: url,
          name: file.name,
          size: file.size,
          type: file.type,
        })
      } else {
        resolve(null)
      }
      document.body.removeChild(input)
    }

    document.body.appendChild(input)
    input.click()
  })
}
