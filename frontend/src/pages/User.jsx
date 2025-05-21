import { useState } from "react";
import api from "../api/client";

export default function User() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    await api.post("/user/upload/", formData);
    alert("File uploaded.");
  };

  const ask = async () => {
    const res = await api.post("/user/query/", {
      query,
      user_id: "user123",
      role: "analyst"
    });
    setAnswer(res.data.answer);
  };

  return (
    <div className="p-6">
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={upload}>Upload</button>
      <textarea value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={ask}>Ask</button>
      <pre className="mt-4 bg-gray-100 p-4">{answer}</pre>
    </div>
  );
}
