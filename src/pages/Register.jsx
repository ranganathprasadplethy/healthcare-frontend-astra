import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { errMsg } from '../api.js';
import { Error, PatientForm } from '../components.jsx';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState('');

  return (
    <div className="auth">
      <h2>Patient Sign Up</h2>
      <Error text={err} />
      <PatientForm creating onSubmit={async (f) => {
        try { await register(f); nav('/appointments'); } catch (x) { setErr(errMsg(x)); }
      }} />
      <p>Already registered? <Link to="/login">Login</Link></p>
    </div>
  );
}
