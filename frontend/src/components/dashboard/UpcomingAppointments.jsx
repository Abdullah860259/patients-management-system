import { Link } from 'react-router-dom';
import { Stethoscope, ArrowRight } from 'lucide-react';

export default function UpcomingAppointments({ upcoming }) {
  if (!upcoming?.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Treatments</h2>
        <Link to="/patient/treatments" className="text-cyan-600 text-sm font-medium hover:text-cyan-700">View All</Link>
      </div>
      <div className="space-y-4">
        {upcoming.map((t, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-cyan-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Stethoscope size={18} className="text-cyan-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">${t.cost?.toLocaleString()}</p>
              {t.durationDays ? <p className="text-xs text-gray-500">{t.durationDays} days</p> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
