import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/marketplace/query-provider";
import { PreferencesProvider } from "@/components/marketplace/preferences-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Micasa Staycations Nyali | Premium Coastal Stays",
  description:
    "Premium Nyali and Mombasa staycations with curated coastal homes, live availability checks, and direct booking support.",
  keywords: ["Micasa Staycations Nyali", "Nyali stays", "Mombasa vacation rentals", "short stays"],
  openGraph: {
    title: "Micasa Staycations Nyali",
    description: "Premium coastal homes and direct booking support in Nyali and Mombasa.",
    type: "website"
  }
};

export const viewport: Viewport = {
  themeColor: "#FF5A5F",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <PreferencesProvider>{children}</PreferencesProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
