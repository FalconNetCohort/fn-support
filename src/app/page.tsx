"use client";

import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GuideManager from "./components/GuideManager";

export default function Home() {
  return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <Header />
        <main className={"flex-grow items-center justify-center p-6"}>
          <h1 className="flex text-2xl md:text-3xl mb-6 justify-center py-6 font-bold">
              Welcome to FalconSupport
          </h1>
          <GuideManager searchEnabled showLimited />
        </main>
        <Footer />
      </div>
  );
}
