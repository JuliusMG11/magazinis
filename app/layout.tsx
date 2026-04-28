import type { Metadata } from 'next'
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
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
  title: 'Daily Digest — Tech & Startup Magazine',
  description: 'A daily curated magazine for tech, startups, frontend, backend, and AI — aggregated from the best sources.',
  openGraph: {
    title: 'Daily Digest',
    description: 'Your daily curated tech magazine.',
    type: 'website',
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
          <main>{children}</main>
          <Footer />
        </EmbedDrawerProvider>
      </body>
    </html>
  )
}
