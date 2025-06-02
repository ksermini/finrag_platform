import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiSearch, FiBarChart2 } from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";
import AskBox from "../components/AskBox";
import AnswerCard from "../components/AnswerCard";
import FileUpload from "../components/FileUpload";

import "../styles/User.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function UserDashboard() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [previousQuery, setPreviousQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [firstName, setFirstName] = useState("there");

  const [groupId, setGroupId] = useState(null);
  const [groupName, setGroupName] = useState("Your business group");
  const [groupRole, setGroupRole] = useState("domain expert");

  const [model, setModel] = useState("");
  const [availableModels, setAvailableModels] = useState([]);

  const logout = async () => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/");
  };

  const secureFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      credentials: "include",
    });

    if (res.status === 401) {
      const refresh = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (refresh.ok) {
        return await fetch(url, {
          ...options,
          credentials: "include",
        });
      } else {
        logout();
        throw new Error("Session expired");
      }
    }

    return res;
  };

  const fetchGroupInfo = async (uid) => {
    try {
      const res = await secureFetch(`${API_BASE}/me/users/${uid}/group`);
      const group = await res.json();
      setGroupId(group.group_id);
      setGroupName(group.group_name || "your business group");
      setGroupRole(group.default_agent_role || "domain expert");
    } catch (err) {
      console.error("Failed to load group info:", err);
      logout();
    }
  };

  const fetchAvailableModels = async () => {
    try {
      const res = await fetch(`${API_BASE}/rag/model`);
      const data = await res.json();
      setAvailableModels(data.models || []);
    } catch (err) {
      console.error("Failed to fetch model list:", err);
    }
  };

  useEffect(() => {
    secureFetch(`${API_BASE}/me`)
      .then((res) => res.json())
      .then((user) => {
        setFirstName(user.first_name || "there");
        setUserId(user.id);
        setRole(user.role || "user");
        fetchGroupInfo(user.id);
        fetchAvailableModels();
      })
      .catch((err) => {
        console.error("Auth or user fetch error:", err);
        logout();
      });
  }, []);

  const handleAsk = async () => {
    if (!query.trim() || !model) return;
    setPreviousQuery(query);

    try {
      const res = await secureFetch(`${API_BASE}/rag/grouped-query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          query,
          user_id: String(userId),
          group_id: groupId,
          role: groupRole,
          model,
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
          {previousQuery && <div className="chat-bubble user">{previousQuery}</div>}
          {answer && (
            <div className="chat-bubble ai">
              <div className="bubble-label">Answer</div>
              <AnswerCard answer={answer} />
            </div>
          )}
        </div>

        <div className="chat-input-wrapper">
          <div className="mb-2 text-sm text-muted">
            <label htmlFor="model" className="mr-2 font-medium text-gray-300">
              Choose a model:
            </label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="rounded p-1 text-black"
            >
              <option value="" disabled>
                Select model
              </option>
              {["gpt-3.5-turbo", "gpt-4", "gpt-4o"].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
              ))}
            </select>
          </div>

          <AskBox query={query} setQuery={setQuery} onSubmit={handleAsk} disabled={!model} />
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
