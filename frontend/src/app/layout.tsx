import type { Metadata } from "next"
import type { ReactNode } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "CHORUS",
  description:
    "Follow live tech news from multiple outlets in one feed, with duplicate stories grouped and recommendations tailored to your reading interests.",
  robots: { index: false },
}

const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Londrina+Solid:wght@300;400;900&family=Mali:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS_URL} />
      </head>
      <body>{children}</body>
    </html>
  )
}
