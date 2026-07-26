import { Link } from 'react-router-dom';
import { Users, Stethoscope, CreditCard, ArrowRight } from 'lucide-react';

const actions = [
  { to: '/admin/patients', icon: Users, label: 'Manage Patients', desc: 'View and manage all patients', color: 'from-blue-500 to-indigo-600' },
  { to: '/admin/treatments', icon: Stethoscope, label: 'All Treatments', desc: 'View clinic-wide treatments', color: 'from-cyan-500 to-blue-600' },
  { to: '/admin/payments', icon: CreditCard, label: 'View Payments', desc: 'Track all payments & revenue', color: 'from-emerald-500 to-teal-600' }
];

export default function AdminQuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {actions.map(({ to, icon: Icon, label, desc, color }, i) => (
        <Link key={i} to={to} className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-0.5">
          <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
            <Icon size={20} className="text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">{label}</h3>
          <p className="text-sm text-gray-500 mt-1">{desc}</p>
          <div className="flex items-center space-x-1 text-indigo-600 text-sm font-medium mt-3 group-hover:space-x-2 transition-all">
            <span>Go to {label}</span><ArrowRight size={14} />
          </div>
        </Link>
      ))}
    </div>
  );
}
