import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, LayoutDashboard } from 'lucide-react';

export default function UserDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">{user.firstName?.[0]}{user.lastName?.[0]}</span>
        </div>
        <span className="text-sm font-medium text-gray-700">{user.firstName}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/patient/dashboard'} onClick={() => setOpen(false)}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </Link>
            <button onClick={() => { onLogout(); setOpen(false); }}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
