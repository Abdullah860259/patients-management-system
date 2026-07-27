import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMe } from './store/slices/authSlice';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientProfile from './pages/PatientProfile';
import AdminDashboard from './pages/AdminDashboard';
import Treatments from './pages/Treatments';
import Payments from './pages/Payments';
import Feedback from './pages/Feedback';
import Analytics from './pages/Analytics';
import AdminPatients from './pages/AdminPatients';
import AdminManagement from './pages/AdminManagement';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600" />
  </div>
);

const ProtectedRoute = ({ children, adminOnly, ceoOnly }) => {
  const { user, token, loading } = useSelector((s) => s.auth);
  if (loading) return <LoadingScreen />;
  if (!token) return <Navigate to="/login" />;
  if (!user && token) return <LoadingScreen />;
  if (ceoOnly && user?.role !== 'ceo') return <Navigate to="/patient/dashboard" />;
  if (adminOnly && user?.role !== 'ceo' && user?.role !== 'admin') return <Navigate to="/patient/dashboard" />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, token } = useSelector((s) => s.auth);
  if (user && token) {
    return <Navigate to={user.role === 'patient' ? '/patient/dashboard' : '/admin/dashboard'} />;
  }
  return children;
};

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);
  const location = useLocation();
  const hideNav = ['/', '/login'].includes(location.pathname);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, [dispatch, token]);

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-w', hideNav ? '0px' : '256px');
    document.documentElement.style.setProperty('--header-h', (!hideNav && token) ? '64px' : '0px');
  }, [hideNav, token]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!hideNav && <Navbar />}
      <main className="flex-1 transition-all duration-300" style={{ marginLeft: hideNav ? 0 : 'var(--sidebar-w)', paddingTop: 'var(--header-h)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/patient/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/patient/treatments" element={<ProtectedRoute><Treatments /></ProtectedRoute>} />
          <Route path="/patient/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
          <Route path="/patient/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
          <Route path="/patient/profile" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute ceoOnly><Analytics /></ProtectedRoute>} />
          <Route path="/admin/treatments" element={<ProtectedRoute adminOnly><Treatments /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute adminOnly><Payments /></ProtectedRoute>} />
          <Route path="/admin/feedback" element={<ProtectedRoute ceoOnly><Feedback /></ProtectedRoute>} />
          <Route path="/admin/patients" element={<ProtectedRoute adminOnly><AdminPatients /></ProtectedRoute>} />
          <Route path="/admin/admins" element={<ProtectedRoute ceoOnly><AdminManagement /></ProtectedRoute>} />
        </Routes>
      </main>
      <div className="transition-all duration-300" style={{ marginLeft: hideNav ? 0 : 'var(--sidebar-w)', paddingTop: 'var(--header-h)' }}>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
