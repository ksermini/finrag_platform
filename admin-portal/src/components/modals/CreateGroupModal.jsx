// components/modals/CreateGroupModal.jsx
import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const CreateGroupModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    default_agent_role: "domain expert",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await axios.post(`${API_BASE}/groups`, form);
      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create group.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md bg-zinc-900 text-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Create New Group</h2>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="space-y-3 text-sm">
          <input
            name="name"
            placeholder="Group Name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-zinc-800 rounded p-2"
          />
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full bg-zinc-800 rounded p-2"
          />
          <input
            name="default_agent_role"
            placeholder="Default Agent Role"
            value={form.default_agent_role}
            onChange={handleChange}
            className="w-full bg-zinc-800 rounded p-2"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-sm bg-zinc-700 hover:bg-zinc-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 rounded text-sm bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            {saving ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
