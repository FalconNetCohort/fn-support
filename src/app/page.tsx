"use client";
import { useState } from "react";
import Header from "./components/Header";
import Modal from "./components/Modal";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  // Dummy data for FAQs and info
  const data = [
    { id: 1, title: "How to reset password?", content: "To reset your password, go to..." },
    { id: 2, title: "How to contact support?", content: "You can contact support by..." },
    { id: 3, title: "How to update profile?", content: "To update your profile, follow these steps..." },
    // Add more dummy data as needed
  ];

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);

    if (query.length > 0) {
      const filteredResults = data.filter((item) =>
        item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query)
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
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="w-full max-w-5xl text-center">
          <input
            type="text"
            placeholder="Search for FAQs or info..."
            className="w-full p-4 mb-6 border border-gray-300 rounded-lg text-black"
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchTerm.length > 0 && (
            <div className="mt-6">
              {results.length > 0 ? (
                results.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 mb-4 border rounded-lg cursor-pointer"
                    onClick={() => handleResultClick(result)}
                  >
                    <h2 className="mb-2 text-xl font-semibold">{result.title}</h2>
                    <p>{result.content}</p>
                  </div>
                ))
              ) : (
                <p>No results found</p>
              )}
            </div>
          )}
        </div>
        {selectedResult && (
          <Modal
            isOpen={!!selectedResult}
            onClose={handleCloseModal}
            title={selectedResult.title}
            content={selectedResult.content}
          />
        )}
      </main>
    </>
  );
}
