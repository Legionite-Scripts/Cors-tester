export interface TestRequest {
  url: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS"
  headers: Record<string, string>
  body?: string
  timeout?: number
}

export interface TestResult {
  id: string
  request: TestRequest
  timestamp: number
  responseTime: number
  statusCode?: number
  corsEnabled: boolean
  corsHeaders: Record<string, string>
  responseHeaders: Record<string, string>
  error?: string
  preflightRequired?: boolean
  preflightSuccess?: boolean
}

export interface CorsPolicy {
  allowOrigin: string[]
  allowMethods: string[]
  allowHeaders: string[]
  allowCredentials: boolean
  maxAge?: number
}
