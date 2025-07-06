"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { TestResult } from "@/types/cors"
import { History, Trash2, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface HistorySidebarProps {
  history: TestResult[]
  onSelectTest: (test: TestResult) => void
  onClearHistory: () => void
}

export function HistorySidebar({ history, onSelectTest, onClearHistory }: HistorySidebarProps) {
  const getStatusIcon = (result: TestResult) => {
    if (result.corsEnabled) {
      return <CheckCircle className="w-3 h-3 text-green-500" />
    } else if (result.error) {
      return <XCircle className="w-3 h-3 text-red-500" />
    } else {
      return <AlertTriangle className="w-3 h-3 text-yellow-500" />
    }
  }

  return (
    <Card className="glass-card border-gray-200 dark:border-gray-700 h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
            <History className="w-4 h-4 text-blue-500" />
            <span className="font-mono text-sm">History</span>
            {history.length > 0 && (
              <Badge variant="secondary" className="font-mono text-xs">
                {history.length}
              </Badge>
            )}
          </CardTitle>

          {history.length > 0 && (
            <Button onClick={onClearHistory} variant="ghost" size="icon" className="h-6 w-6">
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">No test history yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.slice(0, 20).map((result) => (
              <button
                key={result.id}
                onClick={() => onSelectTest(result)}
                className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200"
              >
                <div className="flex items-start space-x-2">
                  {getStatusIcon(result)}
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs font-medium text-gray-900 dark:text-white truncate">
                      {result.request.method}
                    </div>
                    <div className="font-mono text-xs text-gray-500 dark:text-gray-400 truncate">
                      {new URL(result.request.url).hostname}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="font-mono text-xs px-1 py-0">
                        {result.statusCode || "N/A"}
                      </Badge>
                      <span className="text-xs text-gray-400 font-mono">{result.responseTime}ms</span>
                    </div>
                    <div className="text-xs text-gray-400 font-mono mt-1">
                      {new Date(result.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
