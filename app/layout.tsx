import type { Metadata } from 'next'
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SourceSidebar } from '@/components/layout/SourceSidebar'
import { EmbedDrawerProvider } from '@/components/ui/EmbedDrawer'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['300', '400', '500', '600', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Tech Magazinis — Tech & Startup Magazine',
    template: '%s — Tech Magazinis',
  },
  description: 'A daily curated magazine for tech, startups, frontend, backend, and AI — aggregated every morning from YouTube, podcasts, news, and forums.',
  openGraph: {
    siteName: 'Tech Magazinis',
    title: 'Tech Magazinis — Tech & Startup Magazine',
    description: 'Your daily curated tech magazine.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Magazinis',
    description: 'Your daily curated tech magazine.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Theme bootstrap: runs before React, prevents flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('theme');
                var preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                var theme = stored || preferred;
                document.documentElement.classList.add(theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-canvas text-ink min-h-screen font-sans">
        <EmbedDrawerProvider>
          <Header />
          <div className="flex">
            <SourceSidebar />
            <div className="flex-1 min-w-0">
              <main>{children}</main>
              <Footer />
            </div>
          </div>
        </EmbedDrawerProvider>
      </body>
    </html>
  )
}
