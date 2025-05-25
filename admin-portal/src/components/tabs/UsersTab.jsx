import React, { useEffect, useState } from "react";
import axios from "axios";
import EditUserModal from "../modals/EditUserModal";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [creating, setCreating] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateNew = () => {
    setSelectedUser({
      id: null,
      first_name: "",
      last_name: "",
      email: "",
      role: "",
      is_active: true,
    });
    setCreating(true);
  };

  return (
    <div className="panel-box">
      <div className="panel-box-title flex justify-between items-center">
        <span>User Management</span>
        <button className="modal-button save" onClick={handleCreateNew}>
          + New User
        </button>
      </div>

      <div className="panel-box-content">
        <div className="grid grid-cols-4 font-bold mb-2 text-sm text-gray-500">
          <span>Full Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
        </div>

        {users.length === 0 && (
          <div className="text-sm text-gray-400">No users found.</div>
        )}

        {users.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-4 py-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            onClick={() => {
              setSelectedUser(user);
              setCreating(false);
            }}
          >
            <span>{user.first_name} {user.last_name}</span>
            <span>{user.email}</span>
            <span>{user.role}</span>
            <span>{user.is_active ? "Active" : "Inactive"}</span>
          </div>
        ))}
      </div>

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSaved={() => {
            fetchUsers();
            setSelectedUser(null);
            setCreating(false);
          }}
          isNew={creating}
        />
      )}
    </div>
  );
};

export default UsersTab;
