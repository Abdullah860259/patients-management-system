import { Users, Stethoscope, DollarSign, UserPlus, Star, MessageSquare } from 'lucide-react';

export default function AdminStatsCards({ stats, isAdmin, isCeo }) {
  const cards = [
    { icon: Users, label: 'Total Patients', value: stats?.totalPatients || 0, color: 'text-blue-600', bg: 'bg-blue-50' },
    ...(isAdmin ? [{ icon: UserPlus, label: 'Patients Created', value: stats?.patientsCreated || 0, color: 'text-emerald-600', bg: 'bg-emerald-50' }] : []),
    { icon: Stethoscope, label: 'Total Treatments', value: stats?.totalTreatments || 0, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { icon: DollarSign, label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, color: 'text-purple-600', bg: 'bg-purple-50' },
    ...(isCeo ? [
      { icon: MessageSquare, label: 'Total Feedbacks', value: stats?.totalFeedbacks || 0, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { icon: Star, label: 'Avg Rating', value: stats?.averageRating || '0.0', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    ] : [])
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
      {cards.map(({ icon: Icon, label, value, color, bg }, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
            </div>
            <div className={`${bg} w-11 h-11 rounded-xl flex items-center justify-center`}>
              <Icon size={20} className={color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
