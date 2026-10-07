/**
 * Universal Camera & Document Picker for WelliRecord
 * Enables taking photos of medical slips, lab results, prescriptions, and
 * picking files. Native iOS/Android use expo-image-picker/expo-document-picker;
 * web falls back to a hidden DOM file input.
 */
import { Platform } from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as DocumentPicker from "expo-document-picker"

export interface PickedMediaResult {
  uri: string
  name: string
  size?: number
  type?: string
}

function pickViaDomInput(accept: string, capture?: "environment"): Promise<PickedMediaResult | null> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      return resolve(null)
    }

    const input = document.createElement("input")
    input.type = "file"
    input.accept = accept
    if (capture) input.capture = capture
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

export async function pickImageFromCamera(): Promise<PickedMediaResult | null> {
  if (Platform.OS === "web") {
    return pickViaDomInput("image/*", "environment")
  }

  const permission = await ImagePicker.requestCameraPermissionsAsync()
  if (!permission.granted) return null

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    quality: 0.8,
  })
  if (result.canceled || !result.assets?.[0]) return null

  const asset = result.assets[0]
  return {
    uri: asset.uri,
    name: asset.fileName ?? `capture-${Date.now()}.jpg`,
    size: asset.fileSize,
    type: asset.mimeType ?? "image/jpeg",
  }
}

export async function pickImageFromLibrary(): Promise<PickedMediaResult | null> {
  if (Platform.OS === "web") {
    return pickViaDomInput("image/*")
  }

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (!permission.granted) return null

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.8,
  })
  if (result.canceled || !result.assets?.[0]) return null

  const asset = result.assets[0]
  return {
    uri: asset.uri,
    name: asset.fileName ?? `library-${Date.now()}.jpg`,
    size: asset.fileSize,
    type: asset.mimeType ?? "image/jpeg",
  }
}

export async function pickDocument(): Promise<PickedMediaResult | null> {
  if (Platform.OS === "web") {
    return pickViaDomInput(".pdf,image/*,.doc,.docx")
  }

  const result = await DocumentPicker.getDocumentAsync({
    type: ["application/pdf", "image/*", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    copyToCacheDirectory: true,
  })
  if (result.canceled || !result.assets?.[0]) return null

  const asset = result.assets[0]
  return {
    uri: asset.uri,
    name: asset.name,
    size: asset.size ?? undefined,
    type: asset.mimeType ?? undefined,
  }
}
