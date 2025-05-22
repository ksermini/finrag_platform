import React, { useEffect, useState } from "react";
import axios from "axios";

const QueryOutput = () => {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/query_results/1")
      .then((res) => setResponse(res.data))
      .catch(() => setResponse({ error: "Failed to fetch RAG output" }));
  }, []);

  return (
    <div className="mt-6 border-t border-gray-700 pt-4 text-[13px]">
      <div className="mb-2 text-gray-400">[ RAG OUTPUT ]</div>
      {response?.error && <div className="text-red-500">{response.error}</div>}
      {response && !response.error && (
        <>
          <div className="mb-2 text-white leading-relaxed whitespace-pre-wrap">
            {response.answer}
          </div>
          <div className="mt-2 text-gray-400">Sources:</div>
          <ul className="list-disc list-inside text-white text-sm space-y-1">
            {response.sources?.map((src, idx) => (
              <li key={idx}>
                {src.title || src}
                {src.score && <span className="text-gray-500 ml-2 text-xs">({src.score})</span>}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default QueryOutput;
