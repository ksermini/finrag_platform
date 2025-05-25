import React, { useEffect, useState } from "react";
import axios from "axios";

const QueryOutput = () => {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/query_results")
      .then((res) => setResponse(res.data))
      .catch(() =>
        setResponse({ error: "Failed to fetch RAG output" })
      );
  }, []);

  return (
    <div className="query-output-wrapper">
      <div className="query-output-label">[ RAG OUTPUT ]</div>

      {response?.error && (
        <div className="query-output-error">{response.error}</div>
      )}

      {response && !response.error && (
        <>
          <div className="query-output-answer">{response.answer}</div>
          <div className="query-output-sources-label">Sources:</div>
          <ul className="query-output-sources-list">
            {response.sources?.map((src, idx) => (
              <li key={idx}>
                {src.title || src}
                {src.score && (
                  <span className="query-output-score">
                    ({src.score})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default QueryOutput;
