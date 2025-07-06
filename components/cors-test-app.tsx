"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { TestingPanel } from "@/components/testing-panel"
import { ResultsDisplay } from "@/components/results-display"
import { HistorySidebar } from "@/components/history-sidebar"
import { Footer } from "@/components/footer"
import type { TestResult, TestRequest } from "@/types/cors"
import { performCorsTest } from "@/lib/cors-tester"
import { saveToHistory, getHistory } from "@/lib/storage"

export function CorsTestApp() {
  const [currentTest, setCurrentTest] = useState<TestRequest>({
    url: "",
    method: "GET",
    headers: {},
    body: "",
    timeout: 10000,
  })

  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<TestResult[]>([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const handleTest = useCallback(
    async (request: TestRequest) => {
      setIsLoading(true)
      try {
        const result = await performCorsTest(request)
        const newResults = [result, ...testResults]
        setTestResults(newResults)

        // Save to history
        saveToHistory(result)
        setHistory(getHistory())
      } catch (error) {
        console.error("Test failed:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [testResults],
  )

  const handleBatchTest = useCallback(async (requests: TestRequest[]) => {
    setIsLoading(true)
    const results: TestResult[] = []

    for (const request of requests) {
      try {
        const result = await performCorsTest(request)
        results.push(result)
        setTestResults((prev) => [result, ...prev])
      } catch (error) {
        console.error("Batch test failed for:", request.url, error)
      }
    }

    // Save all to history
    results.forEach(saveToHistory)
    setHistory(getHistory())
    setIsLoading(false)
  }, [])

  const clearResults = useCallback(() => {
    setTestResults([])
  }, [])

  const exportResults = useCallback(() => {
    const dataStr = JSON.stringify(testResults, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `cors-test-results-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }, [testResults])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-6 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            {/* History Sidebar - Hidden on mobile, collapsible on desktop */}
            <div className={`lg:col-span-1 ${showHistory ? "block" : "hidden lg:block"}`}>
              <HistorySidebar
                history={history}
                onSelectTest={(test) => {
                  setCurrentTest({
                    url: test.request.url,
                    method: test.request.method,
                    headers: test.request.headers,
                    body: test.request.body || "",
                    timeout: test.request.timeout || 10000,
                  })
                }}
                onClearHistory={() => {
                  localStorage.removeItem("cors-test-history")
                  setHistory([])
                }}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Testing Panel */}
              <TestingPanel
                currentTest={currentTest}
                onTestChange={setCurrentTest}
                onSingleTest={handleTest}
                onBatchTest={handleBatchTest}
                isLoading={isLoading}
              />

              {/* Results Display */}
              <ResultsDisplay
                results={testResults}
                onClear={clearResults}
                onExport={exportResults}
                isLoading={isLoading}
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Mobile History Toggle */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="lg:hidden fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200 z-50"
        aria-label="Toggle history"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </div>
  )
}
