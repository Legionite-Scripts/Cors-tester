import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'CORS Tester - Cross-Origin Resource Sharing Tool',
    template: '%s | CORS Tester'
  },
  description: 'Test and debug CORS issues with our free online tool. Analyze cross-origin requests, headers, and responses instantly. Perfect for developers working with APIs.',
  keywords: [
    'CORS tester',
    'CORS tool',
    'Cross-Origin Resource Sharing',
    'API testing',
    'CORS headers',
    'web development tools',
    'debug CORS',
    'preflight requests',
    'access-control-allow-origin'
  ],
  generator: 'Next.js',
  metadataBase: new URL('https://cors-tester.vercel.app'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CORS Tester - Cross-Origin Resource Sharing Tool',
    description: 'Test and debug CORS issues with our free online tool. Analyze cross-origin requests instantly.',
    url: 'https://cors-tester.vercel.app', // Replace with your actual domain
    siteName: 'CORS Tester',
    images: [
      {
        url: '/og-image.png', // Create an OG image (1200x630) in /public
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CORS Tester - Cross-Origin Resource Sharing Tool',
    description: 'Test and debug CORS issues with our free online tool',
    images: ['/og-image.png'], // Same as OG image
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },
  manifest: '/site.webmanifest', // Optional: Create this file for PWA
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}