import React, { useState } from 'react';
import client from '../api/client';
import ShinyText from "../../lib/ShinyText/ShinyText"

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file.');

    const formData = new FormData();
    formData.append('file', file); // 👈 must be "file" to match FastAPI param

    try {
      const res = await client.post('/user/upload/', formData);
      setResponse(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Upload failed. Check console for details.');
    }
  };

  return (
    <div>
      <h2>Upload File</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".pdf,.txt"
        />
        <button type="submit">Upload</button>
      </form>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UploadForm;
