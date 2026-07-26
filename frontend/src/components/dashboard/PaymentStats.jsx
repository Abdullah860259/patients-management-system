import { DollarSign, Receipt } from 'lucide-react';

export default function PaymentStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Paid</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">${stats.totalPaid.toLocaleString()}</p>
          </div>
          <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center">
            <DollarSign size={22} className="text-emerald-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Recent Payments</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.recentPayments?.length || 0}</p>
          </div>
          <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
            <Receipt size={22} className="text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
