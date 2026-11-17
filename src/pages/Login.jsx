import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { errMsg } from '../api.js';
import { Error } from '../components.jsx';

export default function Login() {
  const { auth, login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  if (auth) return <Navigate to="/appointments" replace />;

  const submit = async (e) => {
    e.preventDefault();
    try { await login(email, password); nav('/appointments'); } catch (x) { setErr(errMsg(x)); }
  };

  return (
    <form className="card form auth" onSubmit={submit}>
      <h2>Login</h2>
      <Error text={err} />
      <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
      <p>New patient? <Link to="/register">Create an account</Link></p>
    </form>
  );
}
