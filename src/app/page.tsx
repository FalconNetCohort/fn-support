"use client";
import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import Modal from "./components/Modal";

interface UserGuide {
  id: string;
  title: string;
  body: string;
  tags: string[];
  lastUpdated: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<UserGuide[]>([]);
  const [selectedResult, setSelectedResult] = useState<UserGuide | null>(null);
  const [userGuides, setUserGuides] = useState<UserGuide[]>([]);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchUserGuides();
  }, []);


  const fetchUserGuides = async () => {
    try {
      const userGuidesSnapshot = await getDocs(collection(db, "userGuides"));
      setUserGuides(userGuidesSnapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id } as UserGuide))
          .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()));
    } catch (error) {
      console.error("Error fetching user guides:", error);
      // Optionally, display an error message in the UI
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (query.length > 0) {
        const filteredResults = userGuides.filter((item) =>
            item.title.toLowerCase().includes(query) ||
            item.body.toLowerCase().includes(query) ||
            item.tags.some(tag => tag.toLowerCase().includes(query))
        );
        setResults(filteredResults);
      } else {
        setResults([]);
      }
    }, 300); // Adjust debounce delay as necessary
  };

  const handleResultClick = (result: UserGuide) => {
    setSelectedResult(result);
  };

  const handleCloseModal = () => {
    if (selectedResult != null) {
    setSelectedResult(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl mb-6">Welcome to FalconSupport</h1>
        <input
          type="text"
          placeholder="Search for FAQs or user guides..."
          className="w-full p-4 mb-6 border border-gray-300 rounded-lg text-black"
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm.length > 0 ? (
          <div className="mt-6 w-full max-w-5xl">
            {results.length > 0 ? (
              results.map((result) => (
                <div
                  key={result.id}
                  className="p-4 mb-4 border rounded-lg cursor-pointer bg-gray-800"
                  onClick={() => handleResultClick(result)}
                >
                  <h2 className="mb-2 text-xl font-semibold text-white">{result.title}</h2>
                  <div className="flex flex-wrap">
                    {result.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-600 text-white px-2 py-1 rounded-full mr-2 mb-2">{tag}</span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No results found</p>
            )}
          </div>
        ) : (
            <div className="mb-8 grid mx-auto gap-8 grid-cols-4">
              {userGuides && userGuides.slice(0, 4).map((guide) => (
                  <div
                      key={guide.id}
                      className="p-16 mb-4 border rounded-lg cursor-pointer bg-gray-800"
                      onClick={() => handleResultClick(guide)}
                  >
                    <h2 className="mb-2 text-xl font-semibold text-white">{guide.title}</h2>
                    <div className="flex flex-wrap">
                      {guide.tags.map((tag, index) => (
                          <span key={index} className="bg-blue-600 text-white px-2 py-1 rounded-full mr-2 mb-2">{tag}</span>
                      ))}
                    </div>
                  </div>
              ))}
            </div>
        )}
        {typeof window !== "undefined" && selectedResult && (
            <Modal
                isOpen={!!selectedResult}
                onClose={handleCloseModal}
                title={selectedResult.title}
                content={selectedResult.body}
            />
        )}
      </main>
      <Footer/>
    </div>
  );
}
