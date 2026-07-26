import { Link } from 'react-router-dom';
import { Stethoscope, CreditCard, MessageSquare, ArrowRight } from 'lucide-react';

const actions = [
  { to: '/patient/treatments', icon: Stethoscope, label: 'My Treatments', color: 'from-cyan-500 to-blue-600' },
  { to: '/patient/payments', icon: CreditCard, label: 'My Payments', color: 'from-emerald-500 to-teal-600' },
  { to: '/patient/feedback', icon: MessageSquare, label: 'Send Feedback', color: 'from-purple-500 to-indigo-600' }
];

export default function QuickActions({ stats, paymentStats }) {
  const counts = [
    stats?.totalTreatments || 0,
    paymentStats?.totalPaid ? `$${paymentStats.totalPaid.toLocaleString()}` : '$0',
    undefined
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {actions.map(({ to, icon: Icon, label, color }, i) => (
        <Link key={i} to={to} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-0.5">
          <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <Icon size={22} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
          {counts[i] !== undefined && <p className="text-sm text-gray-500 mt-1">{counts[i]}</p>}
          <div className="flex items-center space-x-1 text-cyan-600 text-sm font-medium mt-3 group-hover:space-x-2 transition-all">
            <span>View Details</span><ArrowRight size={14} />
          </div>
        </Link>
      ))}
    </div>
  );
}
