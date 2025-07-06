import type { TestRequest, TestResult } from "@/types/cors"

export async function performCorsTest(request: TestRequest): Promise<TestResult> {
  const startTime = Date.now()
  const testId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  try {
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), request.timeout || 10000)

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        ...request.headers,
      },
      signal: controller.signal,
      mode: "cors", // This will trigger CORS
    }

    // Add body for methods that support it
    if (request.body && ["POST", "PUT", "PATCH"].includes(request.method)) {
      fetchOptions.body = request.body
    }

    // Perform the actual request
    const response = await fetch(request.url, fetchOptions)
    clearTimeout(timeoutId)

    const endTime = Date.now()
    const responseTime = endTime - startTime

    // Extract headers
    const responseHeaders: Record<string, string> = {}
    const corsHeaders: Record<string, string> = {}

    response.headers.forEach((value, key) => {
      responseHeaders[key] = value

      // Identify CORS-related headers
      if (key.toLowerCase().startsWith("access-control-")) {
        corsHeaders[key] = value
      }
    })

    // Determine if CORS is enabled
    const corsEnabled = Object.keys(corsHeaders).length > 0 || response.ok

    return {
      id: testId,
      request,
      timestamp: startTime,
      responseTime,
      statusCode: response.status,
      corsEnabled,
      corsHeaders,
      responseHeaders,
      preflightRequired: shouldRequirePreflight(request),
      preflightSuccess: response.ok,
    }
  } catch (error: any) {
    const endTime = Date.now()
    const responseTime = endTime - startTime

    // Analyze the error to determine CORS issues
    let corsError = false
    let errorMessage = error.message

    if (error.name === "TypeError" && error.message.includes("CORS")) {
      corsError = true
      errorMessage = "CORS policy blocked this request"
    } else if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
      corsError = true
      errorMessage = "Request blocked - likely due to CORS policy"
    } else if (error.name === "AbortError") {
      errorMessage = "Request timed out"
    }

    return {
      id: testId,
      request,
      timestamp: startTime,
      responseTime,
      corsEnabled: false,
      corsHeaders: {},
      responseHeaders: {},
      error: errorMessage,
      preflightRequired: shouldRequirePreflight(request),
      preflightSuccess: false,
    }
  }
}

function shouldRequirePreflight(request: TestRequest): boolean {
  // Simple preflight detection logic
  const simpleHeaders = ["accept", "accept-language", "content-language", "content-type"]
  const hasCustomHeaders = Object.keys(request.headers).some((header) => !simpleHeaders.includes(header.toLowerCase()))

  const isSimpleMethod = ["GET", "HEAD", "POST"].includes(request.method)
  const hasSimpleContentType =
    !request.headers["content-type"] ||
    ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"].includes(request.headers["content-type"])

  return !isSimpleMethod || hasCustomHeaders || !hasSimpleContentType
}
