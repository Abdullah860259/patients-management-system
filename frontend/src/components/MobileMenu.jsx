import { Link } from 'react-router-dom';
import { Home, LayoutDashboard, Stethoscope, CreditCard, MessageSquare, Users, LogOut } from 'lucide-react';

const iconMap = {
  Home: Home,
  Dashboard: LayoutDashboard,
  Treatments: Stethoscope,
  Payments: CreditCard,
  Feedback: MessageSquare,
  Patients: Users
};

export default function MobileMenu({ navLinks, user, isActive, onClose, onLogout }) {
  return (
    <div className="md:hidden pb-4 border-t border-gray-100 mt-2">
      {navLinks.map(({ path, label }) => {
        if (!user && path !== '/') return null;
        const Icon = iconMap[label] || Home;
        return (
          <Link key={path} to={path} onClick={onClose}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium ${
              isActive(path) ? 'bg-cyan-50 text-cyan-700' : 'text-gray-600 hover:bg-gray-50'
            }`}>
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        );
      })}
      {user ? (
        <button onClick={() => { onLogout(); onClose(); }}
          className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 w-full">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      ) : (
        <div className="px-4 py-3 space-y-2">
          <Link to="/login" onClick={onClose} className="block text-center py-2 text-sm font-medium text-cyan-600 border border-cyan-600 rounded-lg">Login</Link>

        </div>
      )}
    </div>
  );
}
