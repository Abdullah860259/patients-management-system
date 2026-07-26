import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllPatients, createPatient } from '../store/slices/adminSlice';
import { Search, Mail, Phone, Calendar, Plus, X, ChevronLeft, ChevronRight, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import PatientProfileModal from '../components/admin/PatientProfileModal';

export default function AdminPatients() {
  const { user } = useSelector((s) => s.auth);
  const { patients } = useSelector((s) => s.admin);
  const dispatch = useDispatch();
  const isAdmin = user?.role === 'admin' || user?.role === 'ceo';
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: 'male' });
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      dispatch(fetchAllPatients({ search, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [search, dispatch]);

  useEffect(() => {
    dispatch(fetchAllPatients({ search, page }));
  }, [page, dispatch]);

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    const res = await dispatch(createPatient(form));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Patient created successfully');
      setShowModal(false);
      setForm({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: 'male' });
      dispatch(fetchAllPatients({ search: '', page: 1 }));
      window.open(`/api/admin/patients/${res.payload.patient._id}/prescription`, '_blank');
    } else {
      toast.error(res.payload?.message || 'Failed to create patient');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Patients</h1>
          <p className="text-gray-600 mt-1">View and manage patients</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'ceo') && (
          <button onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-md transition-all">
            <Plus size={18} /><span>Create Patient</span>
          </button>
        )}
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search by name, email, or phone..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Patient</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Phone</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Gender</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Joined</th>
                {isAdmin && <th className="text-right py-3 px-4 text-gray-500 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {patients.items?.length === 0 ? (
                <tr><td colSpan={isAdmin ? 6 : 5} className="text-center py-12 text-gray-500">No patients found</td></tr>
              ) : (
                patients.items?.map((p, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-indigo-50 transition-colors cursor-pointer" onClick={() => setSelectedPatient(p)}>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{p.firstName?.[0]}{p.lastName?.[0]}</span>
                        </div>
                        <span className="font-medium text-gray-900">{p.firstName} {p.lastName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5 text-gray-600">
                        <Mail size={14} /><span>{p.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5 text-gray-600">
                        <Phone size={14} /><span>{p.phone || '-'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{p.gender || '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5 text-gray-500">
                        <Calendar size={14} />
                        <span>{new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4 text-right">
                        <button onClick={(e) => { e.stopPropagation(); window.open(`/api/admin/patients/${p._id}/prescription`, '_blank'); }}
                          className="p-2 rounded-lg text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 transition-all"
                          title="Print Prescription">
                          <Printer size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {patients.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">Page {patients.currentPage} of {patients.totalPages} ({patients.total} total)</p>
          <div className="flex items-center space-x-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"><ChevronLeft size={18} /></button>
            <button disabled={page >= patients.totalPages} onClick={() => setPage(page + 1)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"><ChevronRight size={18} /></button>
          </div>
        </div>
      )}

      {selectedPatient && (
        <PatientProfileModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create Patient</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                  <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-md">
                Create Patient
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}