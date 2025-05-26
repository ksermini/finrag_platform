import React, { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const VectorExplorer = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/admin/vector-search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setResults([]);
      } else {
        setResults(data.documents || []);
      }
    } catch (err) {
      setError("Network error or invalid response");
    }
  };

  return (
    <>
    <div className="tool-description">
    Explore the content of indexed document vectors. Useful for validating chunking, embeddings, and topic coverage.
    </div>
    <div className="text-xs space-y-2">
      <div className="font-bold">[ Vector Explorer ]</div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-black border border-gray-600 px-2 py-1 w-full"
        placeholder="Enter vector search query..."
      />
      <button onClick={handleSearch} className="bg-gray-700 px-3 py-1 text-white mt-1">
        Search
      </button>
      {error && <div className="text-red-400">{error}</div>}
      <ul className="mt-2 space-y-1">
        {results.map((r, i) => (
          <li key={i} className="border-b border-gray-700 pb-1 text-gray-300">
            {typeof r === "string" ? r : JSON.stringify(r, null, 2)}
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default VectorExplorer;
