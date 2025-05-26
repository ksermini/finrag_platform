import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AssignUserToGroupModal = ({ group, onClose, onAssigned }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [role, setRole] = useState("member");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE}/admin/users`)
      .then((res) => setUsers(res.data))
      .catch(() => setError("Failed to load users"));
  }, []);

  const handleAssign = async () => {
    if (!selectedUserId) {
      setError("Please select a user.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/groups/assign`, {
        user_id: selectedUserId,
        group_id: group.id,
        role: role,
      });

      onAssigned();
      onClose();
    } catch (err) {
      setError("Failed to assign user to group.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-zinc-900 text-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
        <h2 className="text-lg font-semibold">Assign User to Group</h2>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex flex-col gap-3 text-sm">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="bg-zinc-800 p-2 rounded"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email} — {user.first_name} {user.last_name}
              </option>
            ))}
          </select>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-zinc-800 p-2 rounded"
          >
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
            <option value="owner">Owner</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={loading}
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-sm"
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignUserToGroupModal;
