"use client";

import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GuideManager from "./components/GuideManager";

export default function Home() {
  return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <h1 className="text-3xl mb-6">Welcome to FalconSupport</h1>
          <GuideManager searchEnabled showLimited />
        </main>
        <Footer />
      </div>
  );
}
