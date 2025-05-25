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
    <div className="modal-overlay">
      <div className="edit-user-modal">
        <h2 className="modal-title">Edit User</h2>
        <div className="modal-body">
          <input
            className="modal-input"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Username"
          />
          <input
            className="modal-input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
          />
          <select
            className="modal-input"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option>Viewer</option>
            <option>Analyst</option>
            <option>Admin</option>
          </select>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="modal-button cancel">
            Cancel
          </button>
          <button onClick={saveUser} className="modal-button save">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
