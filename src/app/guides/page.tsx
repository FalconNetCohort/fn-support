"use client";

import React, {Suspense} from "react";
import GuideManager from "../components/GuideManager";
import AdminAuthWrapper from "../components/AdminAuthWrapper";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loading from "@/app/loading/page";

const GuidesPageContent = () => {
  return (
      <AdminAuthWrapper>
        <Header />
        <main className="p-6 bg-gray-900 text-white min-h-screen">
          <h1 className="flex justify-center text-3xl mb-6">Manage Guides</h1>
          <GuideManager searchEnabled adminMode />
        </main>
        <Footer />
      </AdminAuthWrapper>
  );
}

const GuidesPage = () => {
    return (
        <Suspense fallback={<Loading />}>
            <GuidesPageContent />
        </Suspense>
    );
};

export default GuidesPage;