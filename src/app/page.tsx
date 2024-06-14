"use client";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { db, analytics, logEvent } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import Modal from "./components/Modal";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [userGuides, setUserGuides] = useState([]);

  useEffect(() => {
    logEvent(analytics, 'home_page_view');
    fetchUserGuides();
  }, []);

  const fetchUserGuides = async () => {
    const userGuidesSnapshot = await getDocs(collection(db, "userGuides"));
    setUserGuides(userGuidesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);

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
  };

  const handleResultClick = (result) => {
    setSelectedResult(result);
  };

  const handleCloseModal = () => {
    setSelectedResult(null);
  };

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-900 text-white">
        <h1 className="text-3xl mb-6">Welcome to FalconNet Support</h1>
        <input
          type="text"
          placeholder="Search for FAQs or user guides..."
          className="w-full p-4 mb-6 border border-gray-300 rounded-lg text-black"
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm.length > 0 && (
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
        )}
        {selectedResult && (
          <Modal
            isOpen={!!selectedResult}
            onClose={handleCloseModal}
            title={selectedResult.title}
            content={selectedResult.body}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
