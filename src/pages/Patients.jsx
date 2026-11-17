import { useEffect, useState } from 'react';
import api, { errMsg, fmtDate } from '../api.js';
import { Error, Pager, PatientForm } from '../components.jsx';

export default function Patients() {
  const [data, setData] = useState({ items: [], pages: 1 });
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [form, setForm] = useState(null); // null | 'new' | patient being edited
  const [err, setErr] = useState('');

  const load = () => api.get('/patients', { params: { page, q } }).then((r) => setData(r.data)).catch((e) => setErr(errMsg(e)));
  useEffect(() => { load(); }, [page, q]);

  const save = async (f) => {
    try {
      if (form === 'new') await api.post('/patients', f);
      else await api.put(`/patients/${form._id}`, f);
      setForm(null); setErr(''); load();
    } catch (e) { setErr(errMsg(e)); }
  };

  return (
    <>
      <div className="row between">
        <h2>Patients</h2>
        <button onClick={() => setForm('new')}>+ Add patient</button>
      </div>
      <Error text={err} />
      {form && <PatientForm creating={form === 'new'} initial={form === 'new' ? {} : form} onSubmit={save} onCancel={() => setForm(null)} />}
      <input className="search" placeholder="Search by name..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>DOB</th><th>Gender</th><th>Phone</th><th></th></tr></thead>
        <tbody>
          {data.items.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td><td>{p.user?.email}</td><td>{fmtDate(p.dob)}</td><td>{p.gender}</td><td>{p.phone}</td>
              <td><button className="secondary" onClick={() => setForm(p)}>Edit</button></td>
            </tr>
          ))}
          {!data.items.length && <tr><td colSpan="6">No patients found</td></tr>}
        </tbody>
      </table>
      <Pager data={data} page={page} setPage={setPage} />
    </>
  );
}
