import { Activity, TrendingUp } from 'lucide-react';

export default function StatCards({ stats, paymentStats }) {
  const cards = [
    { icon: Activity, label: 'Total Treatments', value: stats?.totalTreatments || 0, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { icon: TrendingUp, label: 'Total Cost', value: `$${(stats?.totalCost || 0).toLocaleString()}`, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {cards.map(({ icon: Icon, label, value, color, bg }, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
            </div>
            <div className={`${bg} w-12 h-12 rounded-xl flex items-center justify-center`}>
              <Icon size={22} className={color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
