"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TestRequest } from "@/types/cors"
import { validateUrl } from "@/lib/validation"
import { Play, Plus, Trash2, Upload, Zap } from "lucide-react"

interface TestingPanelProps {
  currentTest: TestRequest
  onTestChange: (test: TestRequest) => void
  onSingleTest: (test: TestRequest) => void
  onBatchTest: (tests: TestRequest[]) => void
  isLoading: boolean
}

export function TestingPanel({ currentTest, onTestChange, onSingleTest, onBatchTest, isLoading }: TestingPanelProps) {
  const [headerKey, setHeaderKey] = useState("")
  const [headerValue, setHeaderValue] = useState("")
  const [batchUrls, setBatchUrls] = useState("")
  const [urlError, setUrlError] = useState("")

  const handleUrlChange = useCallback(
    (url: string) => {
      onTestChange({ ...currentTest, url })
      if (url && !validateUrl(url)) {
        setUrlError("Please enter a valid URL")
      } else {
        setUrlError("")
      }
    },
    [currentTest, onTestChange],
  )

  const addHeader = useCallback(() => {
    if (headerKey && headerValue) {
      onTestChange({
        ...currentTest,
        headers: { ...currentTest.headers, [headerKey]: headerValue },
      })
      setHeaderKey("")
      setHeaderValue("")
    }
  }, [headerKey, headerValue, currentTest, onTestChange])

  const removeHeader = useCallback(
    (key: string) => {
      const newHeaders = { ...currentTest.headers }
      delete newHeaders[key]
      onTestChange({ ...currentTest, headers: newHeaders })
    },
    [currentTest, onTestChange],
  )

  const handleSingleTest = useCallback(() => {
    if (validateUrl(currentTest.url)) {
      onSingleTest(currentTest)
    }
  }, [currentTest, onSingleTest])

  const handleBatchTest = useCallback(() => {
    const urls = batchUrls.split("\n").filter((url) => url.trim() && validateUrl(url.trim()))
    const requests: TestRequest[] = urls.map((url) => ({
      ...currentTest,
      url: url.trim(),
    }))
    if (requests.length > 0) {
      onBatchTest(requests)
    }
  }, [batchUrls, currentTest, onBatchTest])

  const isValidUrl = currentTest.url && validateUrl(currentTest.url)

  return (
    <Card className="glass-card border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
          <Zap className="w-5 h-5 text-blue-500" />
          <span className="font-mono">CORS Testing Panel</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="single" className="font-mono">
              Single Test
            </TabsTrigger>
            <TabsTrigger value="batch" className="font-mono">
              Batch Test
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-6">
            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-medium font-mono">
                Target URL
              </Label>
              <div className="relative">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://api.example.com/endpoint"
                  value={currentTest.url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className={`font-mono ${urlError ? "border-red-500" : ""} ${isValidUrl ? "border-green-500" : ""}`}
                />
                {isValidUrl && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                )}
              </div>
              {urlError && <p className="text-sm text-red-500 font-mono">{urlError}</p>}
            </div>

            {/* HTTP Method */}
            <div className="space-y-2">
              <Label className="text-sm font-medium font-mono">HTTP Method</Label>
              <Select
                value={currentTest.method}
                onValueChange={(method) => onTestChange({ ...currentTest, method: method as any })}
              >
                <SelectTrigger className="font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Headers */}
            <div className="space-y-4">
              <Label className="text-sm font-medium font-mono">Custom Headers</Label>

              {/* Add Header */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Header name"
                  value={headerKey}
                  onChange={(e) => setHeaderKey(e.target.value)}
                  className="font-mono"
                />
                <Input
                  placeholder="Header value"
                  value={headerValue}
                  onChange={(e) => setHeaderValue(e.target.value)}
                  className="font-mono"
                />
                <Button onClick={addHeader} disabled={!headerKey || !headerValue} size="icon" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Headers List */}
              {Object.keys(currentTest.headers).length > 0 && (
                <div className="space-y-2">
                  {Object.entries(currentTest.headers).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="font-mono text-sm">
                        <span className="text-blue-600 dark:text-blue-400">{key}:</span>{" "}
                        <span className="text-gray-700 dark:text-gray-300">{value}</span>
                      </div>
                      <Button onClick={() => removeHeader(key)} size="icon" variant="ghost" className="h-6 w-6">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Request Body */}
            {(currentTest.method === "POST" || currentTest.method === "PUT" || currentTest.method === "PATCH") && (
              <div className="space-y-2">
                <Label htmlFor="body" className="text-sm font-medium font-mono">
                  Request Body
                </Label>
                <Textarea
                  id="body"
                  placeholder='{"key": "value"}'
                  value={currentTest.body}
                  onChange={(e) => onTestChange({ ...currentTest, body: e.target.value })}
                  className="font-mono min-h-[100px]"
                />
              </div>
            )}

            {/* Test Button */}
            <Button
              onClick={handleSingleTest}
              disabled={!isValidUrl || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Testing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Run CORS Test</span>
                </div>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="batch" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="batch-urls" className="text-sm font-medium font-mono">
                URLs (one per line)
              </Label>
              <Textarea
                id="batch-urls"
                placeholder={`https://api.example.com/endpoint1
https://api.example.com/endpoint2
https://api.example.com/endpoint3`}
                value={batchUrls}
                onChange={(e) => setBatchUrls(e.target.value)}
                className="font-mono min-h-[150px]"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {batchUrls.split("\n").filter((url) => url.trim() && validateUrl(url.trim())).length} valid URLs
              </p>
            </div>

            <Button
              onClick={handleBatchTest}
              disabled={
                batchUrls.split("\n").filter((url) => url.trim() && validateUrl(url.trim())).length === 0 || isLoading
              }
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-mono"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Running Batch Test...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Run Batch Test</span>
                </div>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
