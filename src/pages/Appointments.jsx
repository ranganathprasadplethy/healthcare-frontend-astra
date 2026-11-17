import { useEffect, useState } from 'react';
import { useAuth } from '../auth.jsx';
import api, { errMsg, fmt } from '../api.js';
import { Error, Pager } from '../components.jsx';

export default function Appointments() {
  const { auth } = useAuth();
  const isAdmin = auth.user.role === 'admin';
  const [data, setData] = useState({ items: [], pages: 1 });
  const [page, setPage] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ patient: '', doctor: '', start: '', reason: '' });
  const [err, setErr] = useState('');

  const load = () => api.get('/appointments', { params: { page } }).then((r) => setData(r.data)).catch((e) => setErr(errMsg(e)));
  useEffect(() => { load(); }, [page]);
  useEffect(() => {
    api.get('/doctors').then((r) => setDoctors(r.data));
    if (isAdmin) api.get('/patients', { params: { limit: 50 } }).then((r) => setPatients(r.data.items));
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const book = async (e) => {
    e.preventDefault();
    try {
      await api.post('/appointments', { ...form, start: new Date(form.start).toISOString() });
      setOpen(false); setErr(''); setForm({ patient: '', doctor: '', start: '', reason: '' }); load();
    } catch (x) { setErr(errMsg(x)); }
  };

  const cancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try { await api.patch(`/appointments/${id}/cancel`); load(); } catch (x) { setErr(errMsg(x)); }
  };

  return (
    <>
      <div className="row between">
        <h2>{isAdmin ? 'Appointments' : 'My Appointments'}</h2>
        <button onClick={() => setOpen(!open)}>+ Book appointment</button>
      </div>
      <Error text={err} />
      {open && (
        <form className="card form" onSubmit={book}>
          {isAdmin && (
            <select required value={form.patient} onChange={set('patient')}>
              <option value="">Select patient</option>
              {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          )}
          <select required value={form.doctor} onChange={set('doctor')}>
            <option value="">Select doctor</option>
            {doctors.map((d) => <option key={d._id} value={d._id}>{d.name} ({d.specialization})</option>)}
          </select>
          <input required type="datetime-local" value={form.start} onChange={set('start')} />
          <input placeholder="Reason for visit" value={form.reason} onChange={set('reason')} />
          <div className="row"><button type="submit">Book (30 min)</button></div>
        </form>
      )}
      <table>
        <thead><tr>{isAdmin && <th>Patient</th>}<th>Doctor</th><th>When</th><th>Reason</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {data.items.map((a) => (
            <tr key={a._id}>
              {isAdmin && <td>{a.patient?.name}</td>}
              <td>{a.doctor?.name}</td><td>{fmt(a.start)}</td><td>{a.reason}</td>
              <td><span className={`tag ${a.status}`}>{a.status}</span></td>
              <td>{a.status === 'scheduled' && <button className="secondary" onClick={() => cancel(a._id)}>Cancel</button>}</td>
            </tr>
          ))}
          {!data.items.length && <tr><td colSpan="6">No appointments yet</td></tr>}
        </tbody>
      </table>
      <Pager data={data} page={page} setPage={setPage} />
    </>
  );
}
