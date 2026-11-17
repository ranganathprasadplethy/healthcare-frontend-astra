import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Appointments from './pages/Appointments.jsx';
import Patients from './pages/Patients.jsx';
import Doctors from './pages/Doctors.jsx';
import Records from './pages/Records.jsx';
import Profile from './pages/Profile.jsx';

function Layout({ children }) {
  const { auth, logout } = useAuth();
  const isAdmin = auth.user.role === 'admin';
  return (
    <>
      <header className="nav">
        <strong>Healthcare</strong>
        <nav>
          <NavLink to="/appointments">Appointments</NavLink>
          {isAdmin && <NavLink to="/patients">Patients</NavLink>}
          <NavLink to="/doctors">Doctors</NavLink>
          <NavLink to="/records">Records</NavLink>
          {!isAdmin && <NavLink to="/profile">My Profile</NavLink>}
        </nav>
        <span className="who">
          {auth.doctor?.name || auth.patient?.name || auth.user.email} ({isAdmin ? 'admin' : 'patient'})
          <button className="secondary" onClick={logout}>Logout</button>
        </span>
      </header>
      <main>{children}</main>
    </>
  );
}

function Protected({ children, adminOnly }) {
  const { auth, loading } = useAuth();
  if (loading) return <p className="center">Loading...</p>;
  if (!auth) return <Navigate to="/login" replace />;
  if (adminOnly && auth.user.role !== 'admin') return <Navigate to="/appointments" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/appointments" element={<Protected><Appointments /></Protected>} />
      <Route path="/patients" element={<Protected adminOnly><Patients /></Protected>} />
      <Route path="/doctors" element={<Protected><Doctors /></Protected>} />
      <Route path="/records" element={<Protected><Records /></Protected>} />
      <Route path="/profile" element={<Protected><Profile /></Protected>} />
      <Route path="*" element={<Navigate to="/appointments" replace />} />
    </Routes>
  );
}
