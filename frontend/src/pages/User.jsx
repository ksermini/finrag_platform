import { useState } from "react";
import api from "../api/client";

export default function User() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    await api.post("/user/upload/", formData);
    alert("File uploaded.");
  };

  const ask = async () => {
    const res = await api.post("/user/query/", {
      query,
      user_id: "user123",
      role: "analyst"
    });
    setAnswer(res.data.answer);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-indigo-700 mb-6">FinRAG Assistant</h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Financial Document</label>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
            />
            <button
              onClick={upload}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-md"
            >
              Upload
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Ask a Question</label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows="3"
            placeholder="e.g. What are the key risks in this filing?"
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={ask}
            className="mt-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md"
          >
            Ask
          </button>
        </div>

        {answer && (
          <div className="bg-gray-50 p-4 border-l-4 border-green-500 rounded-md">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
