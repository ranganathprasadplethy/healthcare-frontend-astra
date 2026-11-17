import { useEffect, useState } from 'react';
import { useAuth } from '../auth.jsx';
import api, { errMsg } from '../api.js';
import { Error } from '../components.jsx';

const empty = { name: '', specialization: '', phone: '', email: '', password: '' };

export default function Doctors() {
  const { auth } = useAuth();
  const isAdmin = auth.user.role === 'admin';
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState(null); // null | new doctor | existing doctor
  const [err, setErr] = useState('');

  const load = () => api.get('/doctors', { params: { q } }).then((r) => setList(r.data)).catch((e) => setErr(errMsg(e)));
  useEffect(() => { load(); }, [q]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const editing = form && form._id;

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/doctors/${form._id}`, form);
      else await api.post('/doctors', form);
      setForm(null); setErr(''); load();
    } catch (x) { setErr(errMsg(x)); }
  };

  return (
    <>
      <div className="row between">
        <h2>Doctors</h2>
        {isAdmin && <button onClick={() => setForm(empty)}>+ Add doctor</button>}
      </div>
      <Error text={err} />
      {form && (
        <form className="card form" onSubmit={save}>
          <input required placeholder="Full name" value={form.name} onChange={set('name')} />
          <input required placeholder="Specialization" value={form.specialization} onChange={set('specialization')} />
          <input placeholder="Phone" value={form.phone || ''} onChange={set('phone')} />
          {!editing && <input required type="email" placeholder="Login email" value={form.email} onChange={set('email')} />}
          {!editing && <input required type="password" minLength={6} placeholder="Login password (min 6)" value={form.password} onChange={set('password')} />}
          <div className="row">
            <button type="submit">Save</button>
            <button type="button" className="secondary" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}
      <input className="search" placeholder="Search by name..." value={q} onChange={(e) => setQ(e.target.value)} />
      <table>
        <thead><tr><th>Name</th><th>Specialization</th><th>Phone</th>{isAdmin && <th>Login</th>}{isAdmin && <th></th>}</tr></thead>
        <tbody>
          {list.map((d) => (
            <tr key={d._id}>
              <td>{d.name}</td><td>{d.specialization}</td><td>{d.phone}</td>
              {isAdmin && <td>{d.user?.email}</td>}
              {isAdmin && <td><button className="secondary" onClick={() => setForm(d)}>Edit</button></td>}
            </tr>
          ))}
          {!list.length && <tr><td colSpan="5">No doctors found</td></tr>}
        </tbody>
      </table>
    </>
  );
}
