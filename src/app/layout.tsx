import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "LANSUB TRAVEL OS — National Travels",
  description: "Intelligent Travel & Bus Operations Platform. One Platform. Every Bus. Every Booking. Every Employee. Every Rupee.",
  keywords: "bus operations, fleet management, travel management, National Travels, LANSUB",
  authors: [{ name: "Lansub Technologies" }],
  openGraph: {
    title: "LANSUB TRAVEL OS",
    description: "Enterprise Travel Operations Management Platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
