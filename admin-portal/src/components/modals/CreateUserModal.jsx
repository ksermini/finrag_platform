import React, { useState } from "react";
import axios from "axios";


const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const CreateUserModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "user",
    business_group: "",
    account_status: "active",
    phone_number: "",
    job_title: "",
    department: "",
    is_admin: false,
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await axios.post(`${API_BASE}/admin/users`, form);
      onCreated();
      onClose();
    } catch (err) {
      setError("Failed to create user.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl bg-zinc-900 text-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Add New User</h2>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="bg-zinc-800 rounded p-2" />
          <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} className="bg-zinc-800 rounded p-2" />
          <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} className="bg-zinc-800 rounded p-2" />
          <input name="role" placeholder="Role" value={form.role} onChange={handleChange} className="bg-zinc-800 rounded p-2" />
          <input name="business_group" placeholder="Business Group" value={form.business_group} onChange={handleChange} className="bg-zinc-800 rounded p-2" />
          <input name="account_status" placeholder="Status" value={form.account_status} onChange={handleChange} className="bg-zinc-800 rounded p-2" />
          <input name="phone_number" placeholder="Phone" value={form.phone_number} onChange={handleChange} className="bg-zinc-800 rounded p-2" />
          <input name="job_title" placeholder="Job Title" value={form.job_title} onChange={handleChange} className="bg-zinc-800 rounded p-2" />
          <input name="department" placeholder="Department" value={form.department} onChange={handleChange} className="bg-zinc-800 rounded p-2" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_admin" checked={form.is_admin} onChange={handleChange} />
            Admin
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
            Active
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded text-sm bg-zinc-700 hover:bg-zinc-600">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 rounded text-sm bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            {saving ? "Saving..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
