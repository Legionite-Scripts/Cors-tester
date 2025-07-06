"use client"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeScript } from "@/components/theme-script"
import { CorsTestApp } from "@/components/cors-test-app"

export default function Page() {
  return (
    <>
      <ThemeScript />
      <ThemeProvider>
        <CorsTestApp />
      </ThemeProvider>
    </>
  )
}
