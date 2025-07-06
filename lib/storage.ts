import type { TestResult } from "@/types/cors"

const STORAGE_KEY = "cors-test-history"
const MAX_HISTORY_ITEMS = 50

export function saveToHistory(result: TestResult): void {
  try {
    const existing = getHistory()
    const updated = [result, ...existing.slice(0, MAX_HISTORY_ITEMS - 1)]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("Failed to save to history:", error)
  }
}

export function getHistory(): TestResult[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to load history:", error)
    return []
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Failed to clear history:", error)
  }
}
