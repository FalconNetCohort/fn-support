import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import { ThemeProvider } from "next-themes";
import Header from "./components/Header";

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
            disableTransitionOnChange>
          <div className="bg-white text-black dark:bg-gray-900 dark:text-white">
          <Header/>
          {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
