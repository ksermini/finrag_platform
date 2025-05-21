import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem("token", res.data.access_token);
    localStorage.setItem("role", res.data.role);
    navigate(res.data.role === "admin" ? "/admin" : "/user");
  };

  return (
    <div className="p-6">
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
