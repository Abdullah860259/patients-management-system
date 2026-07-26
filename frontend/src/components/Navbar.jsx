import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, logoutUser, changePassword } from '../store/slices/authSlice';
import {
  LayoutDashboard, Stethoscope, CreditCard, MessageSquare,
  Users, Shield, ChevronLeft, ChevronRight, LogOut, Menu, X, Lock, Eye, EyeOff, Settings, BarChart3, User
} from 'lucide-react';
import toast from 'react-hot-toast';

const iconMap = {
  Dashboard: LayoutDashboard, Analytics: BarChart3, Treatments: Stethoscope,
  Payments: CreditCard, Feedback: MessageSquare, Patients: Users, Admins: Shield, Profile: User
};

const patientLinks = [
  { path: '/patient/dashboard', label: 'Dashboard', icon: 'Dashboard' },
  { path: '/patient/treatments', label: 'Treatments', icon: 'Treatments' },
  { path: '/patient/payments', label: 'Payments', icon: 'Payments' },
  { path: '/patient/feedback', label: 'Feedback', icon: 'Feedback' },
  { path: '/patient/profile', label: 'Profile', icon: 'Profile' }
];

const adminLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: 'Dashboard' },
  { path: '/admin/payments', label: 'Payments', icon: 'Payments' },
  { path: '/admin/patients', label: 'Patients', icon: 'Patients' }
];

const ceoLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: 'Dashboard' },
  { path: '/admin/analytics', label: 'Analytics', icon: 'Analytics' },
  { path: '/admin/treatments', label: 'Treatments', icon: 'Treatments' },
  { path: '/admin/payments', label: 'Payments', icon: 'Payments' },
  { path: '/admin/feedback', label: 'Feedback', icon: 'Feedback' },
  { path: '/admin/admins', label: 'Admins', icon: 'Admins' },
  { path: '/admin/patients', label: 'Patients', icon: 'Patients' }
];

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  const isCeo = user?.role === 'ceo';
  const isAdmin = user?.role === 'admin' || isCeo;
  const navLinks = isCeo ? ceoLinks : isAdmin ? adminLinks : patientLinks;

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    const res = await dispatch(changePassword({
      currentPassword: passForm.currentPassword,
      newPassword: passForm.newPassword
    }));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Password changed successfully');
      setShowPasswordModal(false);
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error(res.payload?.message || 'Password change failed');
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    document.documentElement.style.setProperty('--sidebar-w', isDesktop ? (collapsed ? '72px' : '256px') : '0px');
    document.documentElement.style.setProperty('--header-h', user ? '64px' : '0px');
  }, [collapsed, user]);

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      document.documentElement.style.setProperty('--sidebar-w', isDesktop ? (collapsed ? '72px' : '256px') : '0px');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed]);

  useEffect(() => {
    if (!showSettings) return;
    const handleClick = (e) => {
      if (!e.target.closest('.settings-container')) setShowSettings(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showSettings]);

  useEffect(() => {
    if (collapsed) return;
    const handleClick = (e) => {
      const isDesktop = window.innerWidth >= 768;
      if (!isDesktop) return;
      if (!e.target.closest('.sidebar') && !e.target.closest('.hamburger-btn')) {
        setCollapsed(true);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [collapsed]);

  const isActive = (path) => location.pathname === path;

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        {!collapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent whitespace-nowrap">
              DentalCare
            </span>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="mx-auto">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
          </Link>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navLinks.map(({ path, label, icon }) => {
          if (!user && path !== '/') return null;
          const Icon = iconMap[icon];
          return (
            <Link key={path} to={path}
              className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(path)
                  ? 'bg-cyan-50 text-cyan-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-cyan-600'
              }`}
              title={collapsed ? label : undefined}>
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className={`border-t border-gray-100 ${collapsed ? 'p-3 text-center' : 'p-4'}`}>
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-medium">{user.firstName?.[0]}{user.lastName?.[0]}</span>
            </div>
            {!collapsed && (
              <div className="ml-3 flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-900 truncate">{user.firstName} {user.lastName}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!user && (
        <div className={`border-t border-gray-100 p-4 space-y-2 ${collapsed ? 'text-center' : ''}`}>
          <Link to="/login" className={`block ${collapsed ? 'p-2' : 'py-2 px-4'} text-sm font-medium text-cyan-600 border border-cyan-600 rounded-lg hover:bg-cyan-50`}>
            {collapsed ? 'L' : 'Login'}
          </Link>
          <Link to="/register" className={`block ${collapsed ? 'p-2' : 'py-2 px-4'} text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700`}>
            {collapsed ? 'R' : 'Register'}
          </Link>
        </div>
      )}
      <div className="border-t border-gray-100 p-3 text-center hidden md:block">
        <button onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </>
  );

  return (
    <>
      <header className="fixed top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 transition-all duration-300"
        style={{ left: 'var(--sidebar-w, 0px)', right: 0 }}>
        <div className="flex items-center space-x-3">
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="hamburger-btn md:hidden p-2 rounded-lg hover:bg-gray-100">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="hidden md:block">
            <p className="text-sm text-gray-500">Welcome back,</p>
            <p className="text-base font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/" className="md:hidden flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
          </Link>
          <div className="relative settings-container">
            <button onClick={() => setShowSettings(!showSettings)}
              className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
              </div>
              {!collapsed && <Settings size={18} className="text-gray-400 hidden md:block" />}
            </button>
          {showSettings && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
              <button onClick={() => { setShowPasswordModal(true); setShowSettings(false); }}
                className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Lock size={16} className="text-gray-400" />
                <span>Change Password</span>
              </button>
              <hr className="my-1 border-gray-100" />
              <button onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
      </header>
      <aside className={`sidebar fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-40 flex-col transition-all duration-300 hidden md:flex ${collapsed ? 'w-[72px]' : 'w-64'}`}>
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-black/30" onClick={() => setMobileOpen(false)}>
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-20 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="pt-16">
              {sidebarContent}
              {user && (
                <div className="border-t border-gray-100 p-4 space-y-1">
                  <button onClick={() => { setShowPasswordModal(true); setMobileOpen(false); }}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                    <Lock size={16} className="text-gray-400" />
                    <span>Change Password</span>
                  </button>
                  <button onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => {
                const label = field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password';
                const showKey = field === 'currentPassword' ? 'current' : field === 'newPassword' ? 'new' : 'confirm';
                return (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <div className="relative">
                      <input type={showPass[showKey] ? 'text' : 'password'} value={passForm[field]} onChange={(e) => setPassForm({ ...passForm, [field]: e.target.value })}
                        className="w-full p-2.5 pr-10 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" required minLength={6} />
                      <button type="button" onClick={() => setShowPass({ ...showPass, [showKey]: !showPass[showKey] })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPass[showKey] ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                );
              })}
              <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-md">
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
