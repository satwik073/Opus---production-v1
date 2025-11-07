import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/TRPC/Client";
import { Toaster } from "sonner";
import { ThemeProvider } from "./theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Provider } from "jotai";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Opus – Automate Workflows Effortlessly",
  description:
    "Opus helps you connect apps, automate tasks, and build workflows visually — a powerful automation platform inspired by n8n.",
  icons: {
    icon: "/flowW.png",
    apple: "/flowW.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="./flowW.png" type="image/png" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TRPCReactProvider>

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NuqsAdapter>
              <Provider>
                {children}
              </Provider>
            </NuqsAdapter>
          </ThemeProvider>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
