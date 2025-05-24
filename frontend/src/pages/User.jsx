import { useState } from "react";
import api from "../api/client";

import { FiUpload, FiSearch, FiBarChart2 } from "react-icons/fi";
import GlassIcons from "../reactbits/glass/GlassIcons";
import SpotlightCard from "../reactbits/spotlight/SpotlightCard";
import "../reactbits/glass/GlassIcons.css";
import "../reactbits/spotlight/SpotlightCard.css";

import "../styles/User.css"; // Custom layout styles

export default function User() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  const upload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await api.post("/user/upload/", formData);
  };

  const ask = async () => {
    const res = await api.post("/user/query/", {
      query,
      user_id: "user123",
      role: "analyst",
    });
    setAnswer(res.data.answer);
  };

  const sidebarItems = [
    { icon: <FiUpload />, color: "blue", label: "Upload" },
    { icon: <FiSearch />, color: "purple", label: "Ask" },
    { icon: <FiBarChart2 />, color: "green", label: "Insights" },
  ];

  return (
    <div className="user-layout">
      <aside className="sidebar">
        <GlassIcons items={sidebarItems} className="sidebar-icons" />
      </aside>

      <main className="main-content">
        <SpotlightCard spotlightColor="rgba(255,255,255,0.04)">
          <h2 className="section-title">Upload Financial Document</h2>

          <div
            className="dropzone"
            onDrop={(e) => {
              e.preventDefault();
              setFile(e.dataTransfer.files[0]);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            {file ? (
              <p className="text-highlight">{file.name}</p>
            ) : (
              <p>Drag and drop a file here</p>
            )}
          </div>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="file-button"
          />

          <button className="neutral-button" onClick={upload}>
            Upload
          </button>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(255,255,255,0.02)">
          <h2 className="section-title">Ask a Question</h2>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. What are the key risks in this filing?"
            className="query-box"
          />
          <button className="neutral-button" onClick={ask}>
            Ask
          </button>
        </SpotlightCard>

        {answer && (
          <div className="fade-in answer-card">
            <h3 className="answer-title">Answer</h3>
            <p className="answer-text">{answer}</p>
          </div>
        )}
      </main>
    </div>
  );
}
