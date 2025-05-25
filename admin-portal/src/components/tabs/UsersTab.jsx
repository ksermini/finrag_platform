import React, { useEffect, useState } from "react";
import axios from "axios";
import EditUserModal from "../modals/EditUserModal";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = () => {
    axios
      .get("http://localhost:8000/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-2 text-sm relative">
      <div className="text-lg font-bold border-b border-gray-600 pb-2">
        User Management Panel
      </div>
      <div className="grid grid-cols-4 text-gray-400 border-b border-gray-700 pb-1">
        <span>Username</span>
        <span>Email</span>
        <span>Role</span>
        <span>Last Active</span>
      </div>
      {users.map((user, index) => (
        <div
          key={index}
          className="grid grid-cols-4 border-b border-gray-800 py-1 text-white hover:bg-gray-800 cursor-pointer"
          onClick={() => setSelectedUser(user)}
        >
          <span>{user.username}</span>
          <span>{user.email}</span>
          <span>{user.role}</span>
          <span>{user.last_active || "N/A"}</span>
        </div>
      ))}

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSaved={fetchUsers}
        />
      )}
    </div>
  );
};

export default UsersTab;
