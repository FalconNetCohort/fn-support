import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import Header from "./components/Header";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FalconSupport",
  description: "Made by Enrique Oti",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <div className="text-black bg-white dark:text-white dark:bg-gray-900 min-h-[calc(100vh-80px)] font-MyriadPro">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
