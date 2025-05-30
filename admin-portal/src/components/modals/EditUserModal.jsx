import React, { useState, useEffect, useRef } from "react";
import "../../styles/index.css";

const EditUserModal = ({ user, onClose, onSaved }) => {
  const [form, setForm] = useState({});
  const [hasAutoFocused, setHasAutoFocused] = useState(false);
  const emailRef = useRef();

  useEffect(() => {
    if (user?.id) {
      setForm(user);
      if (!hasAutoFocused) {
        setTimeout(() => {
          emailRef.current?.focus();
          setHasAutoFocused(true);
        }, 0);
      }
    }
  }, [user?.id, hasAutoFocused]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveUser = async () => {
    try {
      const res = await fetch(`http://localhost:8000/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update user.");
      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Update failed. Please try again.");
    }
  };

  const Field = ({ label, name, type = "text", span = 6, readOnly = false, inputRef = null }) => (
    <div className={`form-field col-span-${span}`}>
      <label htmlFor={name}>{label}</label>
      <input
        ref={inputRef}
        id={name}
        name={name}
        type={type}
        value={form[name] || ""}
        onChange={handleChange}
        className="modal-input"
        readOnly={readOnly}
      />
    </div>
  );

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-user-heading">
      <div className="modal-form-container">
        <div className="text-sm font-semibold uppercase text-[var(--theme-accent)] mb-6" id="edit-user-heading">
          Edit User
        </div>

        {/* Identity */}
        <div className="form-section">
          <h3>Identity</h3>
          <div className="form-grid">
            <Field label="ID" name="id" span={4} readOnly />
            <Field label="Email" name="email" span={8} inputRef={emailRef} />
            <Field label="First Name" name="first_name" />
            <Field label="Last Name" name="last_name" />
          </div>
        </div>

        {/* Organization */}
        <div className="form-section">
          <h3>Organization</h3>
          <div className="form-grid">
            <Field label="Role" name="role" />
            <Field label="Business Group" name="business_group" />
            <Field label="Permissions" name="permissions" />
            <Field label="Account Status" name="account_status" />
            <Field label="Department" name="department" />
            <Field label="Job Title" name="job_title" />
            <Field label="Manager ID" name="manager_id" />
          </div>
        </div>

        {/* Access */}
        <div className="form-section">
          <h3>Access</h3>
          <div className="form-grid">
            <Field label="Phone Number" name="phone_number" />
            <div className="form-field col-span-6 flex flex-row items-center gap-6 mt-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={!!form.is_active}
                  onChange={handleChange}
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="is_admin"
                  checked={!!form.is_admin}
                  onChange={handleChange}
                />
                Admin
              </label>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="form-section">
          <h3>Notes</h3>
          <textarea
            name="notes"
            value={form.notes || ""}
            onChange={handleChange}
            rows={3}
            className="modal-input w-full"
            placeholder="Enter notes..."
          />
        </div>

        {/* Footer */}
        <div className="form-footer">
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
