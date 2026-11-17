import { useEffect, useState } from 'react';
import { useAuth } from '../auth.jsx';
import api, { errMsg, fmtDate } from '../api.js';
import { Error, Pager } from '../components.jsx';

const empty = { patient: '', doctor: '', diagnosis: '', notes: '', prescriptions: '' };

export default function Records() {
  const { auth } = useAuth();
  const isAdmin = auth.user.role === 'admin';
  const myDoctor = auth.doctor; // logged-in doctor: doctor field is auto-filled by the API
  const [data, setData] = useState({ items: [], pages: 1 });
  const [page, setPage] = useState(1);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState('');

  const load = () => api.get('/records', { params: { page } }).then((r) => setData(r.data)).catch((e) => setErr(errMsg(e)));
  useEffect(() => { load(); }, [page]);
  useEffect(() => {
    if (!isAdmin) return;
    api.get('/patients', { params: { limit: 50 } }).then((r) => setPatients(r.data.items));
    api.get('/doctors').then((r) => setDoctors(r.data));
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    try { await api.post('/records', form); setOpen(false); setForm(empty); setErr(''); load(); }
    catch (x) { setErr(errMsg(x)); }
  };

  return (
    <>
      <div className="row between">
        <h2>{isAdmin ? 'Medical Records' : 'My Medical Records'}</h2>
        {isAdmin && <button onClick={() => setOpen(!open)}>+ Add record</button>}
      </div>
      <Error text={err} />
      {open && (
        <form className="card form" onSubmit={save}>
          <select required value={form.patient} onChange={set('patient')}>
            <option value="">Select patient</option>
            {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          {myDoctor ? <p>Recording as {myDoctor.name}</p> : (
            <select required value={form.doctor} onChange={set('doctor')}>
              <option value="">Select doctor</option>
              {doctors.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          )}
          <input required placeholder="Diagnosis" value={form.diagnosis} onChange={set('diagnosis')} />
          <textarea placeholder="Notes" value={form.notes} onChange={set('notes')} />
          <textarea placeholder="Prescriptions" value={form.prescriptions} onChange={set('prescriptions')} />
          <div className="row"><button type="submit">Save record</button></div>
        </form>
      )}
      {data.items.map((r) => (
        <div className="card" key={r._id}>
          <div className="row between">
            <strong>{r.diagnosis}</strong><span>{fmtDate(r.date)}</span>
          </div>
          {isAdmin && <div>Patient: {r.patient?.name}</div>}
          <div>Doctor: {r.doctor?.name} ({r.doctor?.specialization})</div>
          {r.notes && <p><b>Notes:</b> {r.notes}</p>}
          {r.prescriptions && <p><b>Prescriptions:</b> {r.prescriptions}</p>}
        </div>
      ))}
      {!data.items.length && <p>No records yet</p>}
      <Pager data={data} page={page} setPage={setPage} />
    </>
  );
}
