import { useState, useEffect } from "react";
import { FiUpload, FiSearch, FiBarChart2 } from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";
import AskBox from "../components/AskBox";
import AnswerCard from "../components/AnswerCard";
import FileUpload from "../components/FileUpload";

import "../styles/User.css";

export default function UserDashboard() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [previousQuery, setPreviousQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [firstName, setFirstName] = useState("there");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const email = payload.sub;
        setUserId(email);
        setRole(payload.role);

        fetch(`${import.meta.env.VITE_API_URL}/me/email/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            if (!res.ok) throw new Error("User not found");
            return res.json();
          })
          .then((data) => {
            setFirstName(data.first_name || "there");
          })
          .catch((err) => {
            console.error("Failed to fetch user profile:", err);
          });
      } catch (e) {
        console.error("Invalid token:", e);
      }
    }
  }, []);

  const handleAsk = async () => {
    if (!query.trim() || !userId) return;

    setPreviousQuery(query);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/rag/query/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          query,
          user_id: userId,
          role,
        }),
      });

      const data = await res.json();
      setAnswer(data.answer);
      setQuery("");
    } catch (err) {
      console.error("Error fetching answer:", err);
    }
  };

  const sidebarItems = [
    {
      icon: <FiUpload />, color: "blue", label: "Upload",
      onClick: () => setShowUpload((prev) => !prev),
    },
    { icon: <FiSearch />, color: "blue", label: "Ask" },
    { icon: <FiBarChart2 />, color: "blue", label: "Insights" },
  ];

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      banner={<div className="banner-text">👋 Welcome, {firstName}</div>}
    >
      <div className="chat-main">
        <div className="chat-scroll">
          {previousQuery && <div className="chat-bubble user">🤔 {previousQuery}</div>}
          {answer && (
            <div className="chat-bubble ai">
              <div className="bubble-label">Answer</div>
              <AnswerCard answer={answer} />
            </div>
          )}
        </div>
  
        <div className="chat-input-wrapper">
          <AskBox query={query} setQuery={setQuery} onSubmit={handleAsk} />
        </div>
  
        {showUpload && (
          <div className="glass-card upload">
            <FileUpload onUploadSuccess={() => setShowUpload(false)} />
          </div>
        )}

      </div>
    </DashboardLayout>
  );
  
}
