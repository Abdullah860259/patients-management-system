import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTreatments } from '../store/slices/treatmentSlice';
import { fetchAllTreatments, createTreatment, updateTreatment, deleteTreatment } from '../store/slices/adminSlice';
import TreatmentCard from '../components/dashboard/TreatmentCard';
import { Stethoscope, Plus, X, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '', cost: '', durationDays: '', minimumAdvanceAmount: '' };

export default function Treatments() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items: patientItems, totalPages: ptPages, currentPage: ptPage, loading: ptLoading } = useSelector((s) => s.treatments);
  const { treatments: adminData, loading: adLoading } = useSelector((s) => s.admin);
  const isAdmin = user?.role === 'admin' || user?.role === 'ceo';
  const isCeo = user?.role === 'ceo';
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const items = isAdmin ? adminData.items : patientItems;
  const totalPages = isAdmin ? adminData.totalPages : ptPages;
  const currentPage = isAdmin ? adminData.currentPage : ptPage;
  const loading = isAdmin ? adLoading : ptLoading;

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchAllTreatments({ page }));
    } else {
      dispatch(fetchTreatments({ page }));
    }
  }, [dispatch, page, isAdmin]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({
      name: t.name,
      description: t.description,
      cost: t.cost?.toString() || '',
      durationDays: t.durationDays?.toString() || '',
      minimumAdvanceAmount: t.minimumAdvanceAmount?.toString() || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.cost) {
      toast.error('Please fill in all required fields');
      return;
    }
    const payload = {
      name: form.name,
      description: form.description,
      cost: parseFloat(form.cost),
      durationDays: parseInt(form.durationDays) || 0,
      minimumAdvanceAmount: parseFloat(form.minimumAdvanceAmount) || 0
    };
    const res = editing
      ? await dispatch(updateTreatment({ id: editing._id, data: payload }))
      : await dispatch(createTreatment(payload));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success(editing ? 'Treatment updated' : 'Treatment created');
      setShowModal(false);
      setForm(emptyForm);
      setEditing(null);
      dispatch(fetchAllTreatments({ page }));
    } else {
      toast.error(res.payload?.message || 'Failed to save treatment');
    }
  };

  const handleDelete = async (t) => {
    if (!window.confirm(`Delete "${t.name}"? This cannot be undone.`)) return;
    const res = await dispatch(deleteTreatment(t._id));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Treatment deleted');
      dispatch(fetchAllTreatments({ page }));
    } else {
      toast.error(res.payload?.message || 'Failed to delete treatment');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? 'All Treatments' : 'Treatments'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin ? 'View all clinic treatments' : 'Browse available treatments'}
          </p>
        </div>
        {isCeo && (
          <button onClick={openCreate}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-md transition-all">
            <Plus size={18} /><span>Create Treatment</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600" />
        </div>
      ) : items?.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Stethoscope size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Treatments Found</h3>
          <p className="text-gray-500">{isAdmin ? 'No treatments in the system yet' : 'No treatments available'}</p>
        </div>
      ) : isAdmin ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Treatment</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Description</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Cost</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Duration</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Advance</th>
                  {isCeo && <th className="text-right py-3 px-4 text-gray-500 font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {items.map((t, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-cyan-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{t.name}</td>
                    <td className="py-3 px-4 text-gray-600">{t.description}</td>
                    <td className="py-3 px-4 font-semibold">${t.cost?.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-600">{t.durationDays ? `${t.durationDays} days` : '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{t.minimumAdvanceAmount ? `$${t.minimumAdvanceAmount}` : '-'}</td>
                    {isCeo && (
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-cyan-100 text-cyan-600 mr-1"><Edit2 size={15} /></button>
                        <button onClick={() => handleDelete(t)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500"><Trash2 size={15} /></button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t) => (
            <TreatmentCard key={t._id} treatment={t} isSelected={selected?._id === t._id}
              onClick={() => setSelected(selected?._id === t._id ? null : t)} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">Page {currentPage} of {totalPages}</p>
          <div className="flex items-center space-x-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"><ChevronLeft size={18} /></button>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"><ChevronRight size={18} /></button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Treatment' : 'Create Treatment'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost *</label>
                  <input type="number" step="0.01" min="0" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                  <input type="number" min="0" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Advance ($)</label>
                  <input type="number" step="0.01" min="0" value={form.minimumAdvanceAmount} onChange={(e) => setForm({ ...form, minimumAdvanceAmount: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-md">
                {editing ? 'Update Treatment' : 'Create Treatment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
