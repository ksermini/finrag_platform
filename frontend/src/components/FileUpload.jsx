import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState(null);

  const upload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await fetch(`${import.meta.env.VITE_API_URL}/user/upload/`, {
      method: "POST",
      body: formData,
    });
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

      <button className="neutral-button" onClick={upload}>
        Upload
      </button>
    </div>
  );
}
