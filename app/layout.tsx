import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/components/cart-context"
import { SearchProvider } from "@/components/search-context"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Market Sitesi",
  description: "Online market alışveriş sitesi",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-[#f0f5fa]`}>
        <SearchProvider>
          <Suspense>
            <CartProvider>{children}</CartProvider>
          </Suspense>
        </SearchProvider>
      </body>
    </html>
  )
}
