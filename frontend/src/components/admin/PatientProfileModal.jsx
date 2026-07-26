import { X, Mail, Phone, Calendar, User, MapPin, Shield, Stethoscope, CreditCard } from 'lucide-react';

export default function PatientProfileModal({ patient, onClose }) {
  if (!patient) return null;

  const totalTreatments = patient.treatments?.length || 0;
  const completedTreatments = patient.treatments?.filter(t => t.status === 'completed').length || 0;
  const totalSpent = patient.treatments?.reduce((s, t) => s + t.totalPaid, 0) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Patient Profile</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {patient.firstName?.[0]}{patient.lastName?.[0]}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{patient.firstName} {patient.lastName}</p>
              <p className="text-sm text-gray-500">ID: {patient.idNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-indigo-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-indigo-600">{totalTreatments}</p>
              <p className="text-xs text-gray-600 mt-1">Total Treatments</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{completedTreatments}</p>
              <p className="text-xs text-gray-600 mt-1">Completed</p>
            </div>
            <div className="bg-cyan-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-cyan-600">${totalSpent.toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-1">Total Paid</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 text-sm">
                <Mail size={16} className="text-gray-400" />
                <span className="text-gray-900">{patient.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone size={16} className="text-gray-400" />
                <span className="text-gray-900">{patient.phone || '-'}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <User size={16} className="text-gray-400" />
                <span className="text-gray-900 capitalize">{patient.gender || '-'}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-gray-900">{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</span>
              </div>
              {patient.address?.street && (
                <div className="flex items-center space-x-3 text-sm col-span-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-gray-900">{patient.address.street}, {patient.address.city}, {patient.address.state} {patient.address.zipCode}</span>
                </div>
              )}
            </div>
          </div>

          {patient.dentalHistory && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Dental History</h3>
              <p className="text-sm text-gray-900">{patient.dentalHistory}</p>
            </div>
          )}

          {patient.treatments?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Treatment Records ({patient.treatments.length})
              </h3>
              <div className="space-y-3">
                {patient.treatments.map((t, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Stethoscope size={16} className="text-cyan-600" />
                        <span className="font-semibold text-gray-900">{t.name}</span>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        t.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>{t.status}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Cost: <strong className="text-gray-900">${t.totalCost?.toLocaleString()}</strong></span>
                      <span>Paid: <strong className="text-gray-900">${t.totalPaid?.toLocaleString()}</strong></span>
                      <span className="flex items-center space-x-1"><CreditCard size={14} /><span>{t.payments?.length || 0} payment(s)</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
