// File: src/pages/User.jsx
import { useState } from "react";
import { FiUpload, FiSearch, FiBarChart2 } from "react-icons/fi";
import GlassIcons from "../reactbits/glass/GlassIcons";
import "../reactbits/glass/GlassIcons.css";
import "../styles/User.css";
import FileUpload from "../components/FileUpload";
import AskBox from "../components/AskBox";
import AnswerCard from "../components/AnswerCard";

export default function User() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [previousQuery, setPreviousQuery] = useState("");

  const handleAsk = async () => {
    if (!query.trim()) return;
    setPreviousQuery(query);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/query/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, user_id: "user123", role: "analyst" }),
    });
    const data = await res.json();
    setAnswer(data.answer);
    setQuery("");
  };

  const sidebarItems = [
    { icon: <FiSearch />, color: "cyan", label: "Ask" },
    { icon: <FiBarChart2 />, color: "cyan", label: "Insights" },
    { icon: <FiUpload />, color: "cyan", label: "Upload" },
  ];

  return (
    <div className="user-layout">
      <aside className="sidebar">
        <GlassIcons items={sidebarItems} className="sidebar-icons" />
      </aside>

      <main className="main-content">
        <div className="card ask-section">
          <AskBox query={query} setQuery={setQuery} onSubmit={handleAsk} />
        </div>

        {answer && (
          <>
            <div className="card user-question">{previousQuery}</div>
            <AnswerCard answer={answer} />
          </>
        )}

        <div className="card">
          <FileUpload />
        </div>
      </main>
    </div>
  );
}
