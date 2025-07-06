import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CORS Tester',
  description: 'Created with v0',
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.ico', // /public path
    // or if you want to use different icon files:
    // icon: [
    //   { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    //   { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    // ],
    // shortcut: ['/shortcut-icon.png'],
    // apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
    // other: [{ rel: 'apple-touch-icon-precomposed', url: '/apple-touch-icon-precomposed.png' }],
  },
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