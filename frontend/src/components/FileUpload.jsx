import { useState } from "react";

export default function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token"); // ✅ Get JWT from storage

      const res = await fetch(`${import.meta.env.VITE_API_URL}/rag/upload/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Pass token here
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Upload failed:", errorText);
        setMessage("Upload failed. Check backend or endpoint.");
        return;
      }

      const data = await res.json();
      console.log("Upload succeeded:", data);
      setMessage("✅ Upload successful!");

      if (onUploadSuccess) onUploadSuccess(data);

    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Upload error.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <div
        className="dropzone"
        onDrop={(e) => {
          e.preventDefault();
          setFile(e.dataTransfer.files[0]);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        {file ? (
          <p className="text-highlight">{file.name}</p>
        ) : (
          <p>Drag & drop a file here</p>
        )}
      </div>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="file-button"
      />

      <button
        className="neutral-button"
        onClick={upload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {message && <p className="upload-status">{message}</p>}
    </div>
  );
}
