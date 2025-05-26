import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AssignUserToGroupModal = ({ groupId, onClose, onAssigned }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE}/admin/users`)
      .then((res) => setUsers(res.data))
      .catch(() => setError("Failed to load users."));
  }, []);

  const handleAssign = async () => {
    if (!selectedUserId || !selectedRole) {
      setError("Please select both a user and a role.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${API_BASE}/groups/assign`, {
        user_id: selectedUserId,
        group_id: groupId,
        role: selectedRole,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-zinc-900 text-white w-full max-w-lg p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold">Assign User to Group</h2>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="space-y-2">
          <div>
            <label className="text-sm block mb-1">User</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full bg-zinc-800 p-2 rounded text-sm"
            >
              <option value="">-- Select User --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm block mb-1">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-zinc-800 p-2 rounded text-sm"
            >
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
              <option value="owner">Owner</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="bg-zinc-700 px-4 py-2 rounded text-sm hover:bg-zinc-600"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={loading}
            className="bg-indigo-600 px-4 py-2 rounded text-sm hover:bg-indigo-500 text-white"
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignUserToGroupModal;
