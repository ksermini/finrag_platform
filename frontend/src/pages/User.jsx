import { useState, useEffect } from "react";
import { FiUpload, FiSearch, FiBarChart2 } from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";
import AskBox from "../components/AskBox";
import AnswerCard from "../components/AnswerCard";
import FileUpload from "../components/FileUpload";

import "../styles/User.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function UserDashboard() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [previousQuery, setPreviousQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [firstName, setFirstName] = useState("there");

  // Group metadata
  const [groupName, setGroupName] = useState("Your business group");
  const [groupRole, setGroupRole] = useState("domain expert");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const email = payload.sub;
      setRole(payload.role || "user");

      // First: fetch user
      fetch(`${API_BASE}/me/email/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((user) => {
          setFirstName(user.first_name || "there");
          setUserId(user.id);
          localStorage.setItem("user_id", user.id);

          // Now fetch group info
          return fetch(`${API_BASE}/me/users/${user.id}/group`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        })
        .then((res) => res.json())
        .then((group) => {
          setGroupName(group.group_name || "your business group");
          setGroupRole(group.default_agent_role || "domain expert");

          // Store in localStorage
          localStorage.setItem("group_id", group.group_id);
          localStorage.setItem("group_name", group.group_name);
          localStorage.setItem("agent_role", group.default_agent_role);
        })
        .catch((err) => {
          console.error("Failed to load profile or group info:", err);
        });
    } catch (e) {
      console.error("Invalid token:", e);
    }
  }, []);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setPreviousQuery(query);

    try {
      const res = await fetch(`${API_BASE}/rag/grouped-query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ query }),
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
      icon: <FiUpload />,
      color: "blue",
      label: "Upload",
      onClick: () => setShowUpload((prev) => !prev),
    },
    { icon: <FiSearch />, color: "blue", label: "Ask" },
    { icon: <FiBarChart2 />, color: "blue", label: "Insights" },
  ];

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      banner={
        <div className="banner-text space-y-1">
          {groupName} RAG — Welcome, {firstName}
          <p className="text-xs text-muted">
            You're chatting with a <strong>{groupRole}</strong>
          </p>
        </div>
      }
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
