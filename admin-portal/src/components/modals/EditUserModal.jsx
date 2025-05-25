import React, { useState, useEffect } from "react";
import axios from "axios";

const EditUserModal = ({ user, onClose, onSaved }) => {
  const [form, setForm] = useState(user);

  useEffect(() => {
    setForm(user);
  }, [user]);

  const saveUser = async () => {
    try {
      await axios.put(`http://localhost:8000/users/${user.id}`, form);
      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-600 p-6 rounded-lg w-96 text-white space-y-4">
        <h2 className="text-lg font-bold border-b border-gray-600 pb-2">Edit User</h2>
        <div className="space-y-2">
          <input
            className="w-full bg-gray-800 p-2 rounded"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Username"
          />
          <input
            className="w-full bg-gray-800 p-2 rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
          />
          <select
            className="w-full bg-gray-800 p-2 rounded"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option>Viewer</option>
            <option>Analyst</option>
            <option>Admin</option>
          </select>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button onClick={onClose} className="px-3 py-1 border border-gray-500">Cancel</button>
          <button onClick={saveUser} className="px-3 py-1 bg-green-600">Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
