import { useState } from 'react';
import { useAuth } from '../auth.jsx';
import api, { errMsg } from '../api.js';
import { Error, PatientForm } from '../components.jsx';

export default function Profile() {
  const { auth, refresh } = useAuth();
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  if (!auth.patient) return <p>No patient profile for this account.</p>;

  return (
    <>
      <h2>My Profile</h2>
      <p>Email: {auth.user.email}</p>
      <Error text={err} />
      {msg && <p className="ok">{msg}</p>}
      <PatientForm initial={auth.patient} onSubmit={async (f) => {
        try {
          await api.put(`/patients/${auth.patient._id}`, f);
          await refresh(); setErr(''); setMsg('Profile updated');
        } catch (x) { setMsg(''); setErr(errMsg(x)); }
      }} />
    </>
  );
}
