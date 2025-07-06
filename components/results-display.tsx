"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { TestResult } from "@/types/cors"
import {
  Download,
  Trash2,
  ChevronDown,
  ChevronRight,
  Clock,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Copy,
} from "lucide-react"

interface ResultsDisplayProps {
  results: TestResult[]
  onClear: () => void
  onExport: () => void
  isLoading: boolean
}

export function ResultsDisplay({ results, onClear, onExport, isLoading }: ResultsDisplayProps) {
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedResults)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedResults(newExpanded)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusIcon = (result: TestResult) => {
    if (result.corsEnabled) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    } else if (result.error) {
      return <XCircle className="w-5 h-5 text-red-500" />
    } else {
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (result: TestResult) => {
    if (result.corsEnabled) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">CORS Enabled</Badge>
      )
    } else if (result.error) {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">CORS Blocked</Badge>
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Unknown</Badge>
    }
  }

  if (results.length === 0 && !isLoading) {
    return (
      <Card className="glass-card border-gray-200 dark:border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Globe className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white font-mono mb-2">No Tests Run Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 font-mono">Enter a URL above and run your first CORS test</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
            <Globe className="w-5 h-5 text-blue-500" />
            <span className="font-mono">Test Results</span>
            {results.length > 0 && (
              <Badge variant="secondary" className="font-mono">
                {results.length}
              </Badge>
            )}
          </CardTitle>

          {results.length > 0 && (
            <div className="flex space-x-2">
              <Button onClick={onExport} variant="outline" size="sm" className="font-mono bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={onClear}
                variant="outline"
                size="sm"
                className="font-mono text-red-600 hover:text-red-700 bg-transparent"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600 dark:text-gray-300 font-mono">Running CORS test...</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {results.map((result) => (
            <Collapsible key={result.id}>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <CollapsibleTrigger
                  onClick={() => toggleExpanded(result.id)}
                  className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result)}
                      <div className="text-left">
                        <div className="font-mono text-sm font-medium text-gray-900 dark:text-white truncate max-w-md">
                          {result.request.method} {result.request.url}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusBadge(result)}
                          <Badge variant="outline" className="font-mono text-xs">
                            {result.statusCode || "N/A"}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>{result.responseTime}ms</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                      {expandedResults.has(result.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                    <div className="space-y-4">
                      {/* Error Message */}
                      {result.error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <h4 className="font-mono text-sm font-medium text-red-800 dark:text-red-400 mb-1">
                            Error Details
                          </h4>
                          <p className="font-mono text-sm text-red-700 dark:text-red-300">{result.error}</p>
                        </div>
                      )}

                      {/* CORS Analysis */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-mono text-sm font-medium text-gray-900 dark:text-white mb-2">
                            CORS Headers
                          </h4>
                          <div className="space-y-1">
                            {result.corsHeaders && Object.keys(result.corsHeaders).length > 0 ? (
                              Object.entries(result.corsHeaders).map(([key, value]) => (
                                <div
                                  key={key}
                                  className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded border"
                                >
                                  <span className="font-mono text-xs text-blue-600 dark:text-blue-400">{key}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-mono text-xs text-gray-700 dark:text-gray-300 truncate max-w-32">
                                      {value}
                                    </span>
                                    <Button
                                      onClick={() => copyToClipboard(`${key}: ${value}`)}
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                                No CORS headers found
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-mono text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Response Headers
                          </h4>
                          <div className="space-y-1 max-h-40 overflow-y-auto">
                            {result.responseHeaders && Object.keys(result.responseHeaders).length > 0 ? (
                              Object.entries(result.responseHeaders).map(([key, value]) => (
                                <div
                                  key={key}
                                  className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded border"
                                >
                                  <span className="font-mono text-xs text-gray-600 dark:text-gray-400">{key}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-mono text-xs text-gray-700 dark:text-gray-300 truncate max-w-32">
                                      {value}
                                    </span>
                                    <Button
                                      onClick={() => copyToClipboard(`${key}: ${value}`)}
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                                No response headers available
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Request Details */}
                      <div>
                        <h4 className="font-mono text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Request Details
                        </h4>
                        <div className="p-3 bg-white dark:bg-gray-900 rounded border font-mono text-xs">
                          <div className="space-y-1">
                            <div>
                              <span className="text-gray-500">Method:</span>{" "}
                              <span className="text-blue-600 dark:text-blue-400">{result.request.method}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">URL:</span>{" "}
                              <span className="text-gray-700 dark:text-gray-300 break-all">{result.request.url}</span>
                            </div>
                            {Object.keys(result.request.headers).length > 0 && (
                              <div>
                                <span className="text-gray-500">Headers:</span>
                                <div className="ml-4 mt-1 space-y-1">
                                  {Object.entries(result.request.headers).map(([key, value]) => (
                                    <div key={key}>
                                      <span className="text-blue-600 dark:text-blue-400">{key}:</span>{" "}
                                      <span className="text-gray-700 dark:text-gray-300">{value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {result.request.body && (
                              <div>
                                <span className="text-gray-500">Body:</span>{" "}
                                <span className="text-gray-700 dark:text-gray-300">{result.request.body}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
