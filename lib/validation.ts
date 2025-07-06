export function validateUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return ["http:", "https:"].includes(urlObj.protocol)
  } catch {
    return false
  }
}

export function validateHeaders(headers: Record<string, string>): boolean {
  return Object.entries(headers).every(([key, value]) => {
    return key.trim() !== "" && value.trim() !== ""
  })
}

export function validateJson(jsonString: string): boolean {
  if (!jsonString.trim()) return true // Empty is valid

  try {
    JSON.parse(jsonString)
    return true
  } catch {
    return false
  }
}
