import { useState } from 'react';

export const Error = ({ text }) => (text ? <p className="error">{text}</p> : null);

export function Pager({ data, page, setPage }) {
  if (!data || data.pages <= 1) return null;
  return (
    <div className="pager">
      <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
      <span>Page {page} of {data.pages}</span>
      <button disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}

export function PatientForm({ initial = {}, creating, onSubmit, onCancel }) {
  const [f, setF] = useState({ name: '', email: '', password: '', gender: '', phone: '', address: '', ...initial, dob: initial.dob?.slice(0, 10) || '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <form className="card form" onSubmit={(e) => { e.preventDefault(); onSubmit(f); }}>
      <input required placeholder="Full name" value={f.name} onChange={set('name')} />
      {creating && <input required type="email" placeholder="Email" value={f.email} onChange={set('email')} />}
      {creating && <input required type="password" minLength={6} placeholder="Password (min 6)" value={f.password} onChange={set('password')} />}
      <input type="date" value={f.dob} onChange={set('dob')} title="Date of birth" />
      <select value={f.gender} onChange={set('gender')}>
        <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <input placeholder="Phone" value={f.phone} onChange={set('phone')} />
      <input placeholder="Address" value={f.address} onChange={set('address')} />
      <div className="row">
        <button type="submit">Save</button>
        {onCancel && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
