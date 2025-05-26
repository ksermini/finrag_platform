import React, { useEffect, useState } from "react";
import axios from "axios";
import PanelBox from "../ui/PanelBox";
import GroupDocumentsModal from "../modals/GroupDocumentsModal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const GroupsTab = () => {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [error, setError] = useState("");

  const fetchGroups = () => {
    axios
      .get(`${API_BASE}/groups`)
      .then((res) => setGroups(res.data))
      .catch(() => setGroups([]));
  };

  const handleCreate = async () => {
    if (!name.trim()) return setError("Group name is required.");
    try {
      await axios.post(`${API_BASE}/groups`, { name, description });
      setName("");
      setDescription("");
      setError("");
      fetchGroups();
    } catch (err) {
      setError("Failed to create group. It might already exist.");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <PanelBox title="Group Management" variant="bento" gradient>
      <div className="mb-4 space-y-2">
        <input
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded p-2 bg-zinc-800 text-sm"
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded p-2 bg-zinc-800 text-sm"
        />
        <button
          onClick={handleCreate}
          className="mt-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm text-white"
        >
          + Create Group
        </button>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
        {groups.map((group) => (
          <div
            key={group.id}
            onClick={() => setSelectedGroup(group)}
            className="p-4 bg-zinc-900 rounded border border-zinc-700 hover:border-indigo-500 transition cursor-pointer"
          >
            <div className="text-lg font-semibold">{group.name}</div>
            <div className="text-xs text-zinc-400 mt-1">{group.description}</div>
            <div className="text-xs mt-2 text-zinc-500">
              Default Role: {group.default_agent_role}
            </div>
          </div>
        ))}
      </div>

      {selectedGroup && (
        <GroupDocumentsModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />
      )}
    </PanelBox>
  );
};

export default GroupsTab;
