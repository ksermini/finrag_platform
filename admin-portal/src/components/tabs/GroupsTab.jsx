import React, { useEffect, useState } from "react";
import axios from "axios";
import PanelBox from "../ui/PanelBox";
import AssignUserToGroupModal from "../modals/AssignUserToGroupModal";
import CreateGroupModal from "../modals/CreateGroupModal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const GroupsTab = () => {
  const [groups, setGroups] = useState([]);
  const [expandedGroupId, setExpandedGroupId] = useState(null);
  const [documentsByGroup, setDocumentsByGroup] = useState({});
  const [usersByGroup, setUsersByGroup] = useState({});
  const [uploadingGroup, setUploadingGroup] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API_BASE}/groups`);
      setGroups(res.data);
    } catch (err) {
      console.error("Failed to fetch groups", err);
    }
  };

  const fetchGroupDetails = async (groupId) => {
    try {
      const [docsRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE}/groups/${groupId}/documents`),
        axios.get(`${API_BASE}/groups/${groupId}/users`)
      ]);
      setDocumentsByGroup((prev) => ({ ...prev, [groupId]: docsRes.data }));
      setUsersByGroup((prev) => ({ ...prev, [groupId]: usersRes.data }));
    } catch (err) {
      console.error("Failed to load group details", err);
    }
  };

  const handleUpload = async (e, groupId) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploadingGroup(groupId);

    try {
      await axios.post(`${API_BASE}/groups/${groupId}/documents`, formData);
      await fetchGroupDetails(groupId); // 🔁 Refresh after upload
    } catch {
      alert("Upload failed.");
    } finally {
      setUploadingGroup(null);
    }
  };

  const handleDeleteDoc = async (groupId, docId) => {
    try {
      await axios.delete(`${API_BASE}/groups/${groupId}/documents/${docId}`);
      fetchGroupDetails(groupId);
    } catch {
      alert("Failed to delete document.");
    }
  };

  const handleCreateGroup = async () => {
    const name = prompt("Enter group name:");
    if (!name) return;
  
    const description = prompt("Enter description (optional):") || "";
    const default_agent_role = prompt("Enter default role (optional, e.g., domain expert):") || "domain expert";
  
    try {
      await axios.post(`${API_BASE}/groups`, {
        name,
        description,
        default_agent_role
      });
      fetchGroups();
    } catch (err) {
      alert("Failed to create group.");
    }
  };
  

  const openAssignModal = (group) => {
    setSelectedGroup(group);
    setShowAssignModal(true);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <PanelBox title="Groups & Access Control" variant="bento">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleCreateGroup}
          className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
        >
          + New Group
        </button>
      </div>

      <div className="space-y-6">
        {groups.map((group) => {
          const isExpanded = expandedGroupId === group.id;
          const docs = documentsByGroup[group.id] || [];
          const users = usersByGroup[group.id] || [];

          return (
            <div
              key={group.id}
              className="bg-[var(--theme-surface-muted)] rounded-lg border border-[var(--theme-border)] shadow"
            >
              <div
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-[var(--theme-surface)]"
                onClick={() => {
                  if (!isExpanded) fetchGroupDetails(group.id);
                  setExpandedGroupId(isExpanded ? null : group.id);
                }}
              >
                <div>
                  <div className="text-white font-semibold">{group.name}</div>
                  <div className="text-xs text-[var(--theme-muted)]">
                    {group.description || "No description"} — Role: {group.default_agent_role}
                  </div>
                </div>
                <div className="text-sm text-[var(--theme-muted)]">
                  {isExpanded ? "▲" : "▼"}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-4">
                  <div>
                    <label className="block text-xs text-[var(--theme-muted)] mb-1">
                      Upload PDF
                    </label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleUpload(e, group.id)}
                      disabled={uploadingGroup === group.id}
                      className="text-sm bg-zinc-800 rounded p-1 file:text-white file:bg-indigo-600 file:px-3 file:py-1 file:rounded hover:file:bg-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="text-xs uppercase text-[var(--theme-muted)] mb-1">Documents</div>
                    <ul className="space-y-2 text-sm max-h-48 overflow-y-auto">
                      {docs.map((doc) => (
                        <li
                          key={doc.id}
                          className="flex justify-between items-center bg-zinc-800 p-2 rounded"
                        >
                          <span>{doc.title}</span>
                          <button
                            onClick={() => handleDeleteDoc(group.id, doc.id)}
                            className="text-red-500 text-xs hover:underline"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs uppercase text-[var(--theme-muted)]">Group Users</div>
                      <button
                        onClick={() => openAssignModal(group)}
                        className="text-indigo-400 text-xs hover:underline"
                      >
                        + Add User
                      </button>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {users.map((user) => (
                        <li key={user.id} className="flex justify-between items-center bg-zinc-800 p-2 rounded">
                          <div>
                            <div>{user.email}</div>
                            <div className="text-xs text-[var(--theme-muted)]">Role: {user.role}</div>
                          </div>
                          <button className="text-red-400 text-xs hover:underline">Remove</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showAssignModal && selectedGroup && (
        <AssignUserToGroupModal
          group={selectedGroup}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedGroup(null);
          }}
          onAssigned={() => fetchGroupDetails(selectedGroup.id)}
        />
      )}
    </PanelBox>
  );
};

export default GroupsTab;
