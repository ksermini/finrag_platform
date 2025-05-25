import React, { useEffect, useState } from "react";
import axios from "axios";
import EditUserModal from "../modals/EditUserModal";
import PanelBox from "../PanelBox";

const columnHeaders = [
  "ID", "Email", "First", "Last", "Role", "Group", "Status",
  "Phone", "Title", "Department", "Admin", "Active", "Actions"
];

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = () => {
    axios
      .get("http://localhost:8000/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <PanelBox title="User Management">
      <div className="flex justify-between items-center mb-4">
        <button className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-700 transition">
          + New User
        </button>
      </div>

      <div className="overflow-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs uppercase">
            <tr>
              {columnHeaders.map((col, idx) => (
                <th key={idx} className="px-4 py-3 text-left whitespace-nowrap font-semibold tracking-wide">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {users.map((user, idx) => (
              <tr key={user.id || idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.first_name}</td>
                <td className="px-4 py-2">{user.last_name}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2">{user.business_group}</td>
                <td className="px-4 py-2">{user.account_status}</td>
                <td className="px-4 py-2">{user.phone_number}</td>
                <td className="px-4 py-2">{user.job_title}</td>
                <td className="px-4 py-2">{user.department}</td>
                <td className="px-4 py-2">{user.is_admin ? "Yes" : "No"}</td>
                <td className="px-4 py-2">{user.is_active ? "Yes" : "No"}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-indigo-600 hover:underline text-xs"
                    onClick={() => setSelectedUser(user)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSaved={fetchUsers}
        />
      )}
    </PanelBox>
  );
};

export default UsersTab;
