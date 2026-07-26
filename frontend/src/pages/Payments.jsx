import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPayments, fetchPaymentStats } from '../store/slices/paymentSlice';
import { fetchAllPayments, createPayment } from '../store/slices/adminSlice';
import PaymentCard from '../components/dashboard/PaymentCard';
import PaymentStats from '../components/dashboard/PaymentStats';
import { CreditCard, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../utils/api';

export default function Payments() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items: patientItems, totalPages: ptPages, currentPage: ptPage, stats, loading: ptLoading } = useSelector((s) => s.payments);
  const { payments: adminData, loading: adLoading } = useSelector((s) => s.admin);
  const isAdmin = user?.role === 'admin' || user?.role === 'ceo';
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [patientList, setPatientList] = useState([]);
  const [treatmentList, setTreatmentList] = useState([]);
  const [form, setForm] = useState({
    patient: '', treatment: '', paidAmount: '',
    paymentMethod: 'Cash', notes: ''
  });

  const items = isAdmin ? adminData.items : patientItems;
  const totalPages = isAdmin ? adminData.totalPages : ptPages;
  const currentPage = isAdmin ? adminData.currentPage : ptPage;
  const loading = isAdmin ? adLoading : ptLoading;

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchAllPayments({ page }));
    } else {
      dispatch(fetchPayments({ page }));
    }
  }, [dispatch, page, isAdmin]);

  useEffect(() => {
    if (!isAdmin) dispatch(fetchPaymentStats());
  }, [dispatch, isAdmin]);

  const openCreateModal = async () => {
    setShowModal(true);
    try {
      const [patientsRes, treatmentsRes] = await Promise.all([
        API.get('/admin/patients?limit=500'),
        API.get('/admin/treatments?limit=500')
      ]);
      setPatientList(patientsRes.data.patients || []);
      setTreatmentList(treatmentsRes.data.treatments || []);
    } catch (err) {
      console.error('Failed to fetch patients/treatments', err);
    }
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    if (!form.patient || !form.treatment || !form.paidAmount || !form.paymentMethod) {
      toast.error('Please fill in all required fields');
      return;
    }
    const res = await dispatch(createPayment({
      patient: form.patient, treatment: form.treatment,
      paidAmount: parseFloat(form.paidAmount),
      paymentMethod: form.paymentMethod, notes: form.notes
    }));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Payment created successfully');
      setShowModal(false);
      setForm({ patient: '', treatment: '', paidAmount: '', paymentMethod: 'Cash', notes: '' });
      dispatch(fetchAllPayments({ page }));
      window.open(`/api/admin/payments/${res.payload.payment._id}/treatment-summary`, '_blank');
    } else {
      toast.error(res.payload?.message || 'Failed to create payment');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? 'All Payments' : 'My Payments'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin ? 'View clinic-wide payments and revenue' : 'View your payment history and manage expenses'}
          </p>
        </div>
        {isAdmin && (
          <button onClick={openCreateModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-md transition-all">
            <Plus size={18} /><span>Create Payment</span>
          </button>
        )}
      </div>

      {!isAdmin && <PaymentStats stats={stats} />}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600" />
        </div>
      ) : items?.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Payments Found</h3>
          <p className="text-gray-500">{isAdmin ? 'No payments in the system yet' : 'Your payment history will appear here'}</p>
        </div>
      ) : isAdmin ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Patient</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Treatment</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Method</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-cyan-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{p.patient?.firstName?.[0]}{p.patient?.lastName?.[0]}</span>
                        </div>
                        <span className="font-medium text-gray-900">{p.patient?.firstName} {p.patient?.lastName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{p.treatment?.name || 'Treatment'}</td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(p.paymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-600">${p.paidAmount?.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-600">{p.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((p) => (
            <PaymentCard key={p._id} payment={p} isSelected={selected?._id === p._id}
              onClick={() => setSelected(selected?._id === p._id ? null : p)} />
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
              <h2 className="text-xl font-bold text-gray-900">Create Payment</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreatePayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                  <select value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" required>
                    <option value="">Select patient</option>
                    {patientList.map((p) => (
                      <option key={p._id} value={p._id}>{p.firstName} {p.lastName} ({p.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Treatment *</label>
                  <select value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" required>
                    <option value="">Select treatment</option>
                    {treatmentList.map((t) => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount *</label>
                  <input type="number" step="0.01" min="0" value={form.paidAmount} onChange={(e) => setForm({ ...form, paidAmount: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                  <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500">
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Online Payment">Online Payment</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-md">
                Create Payment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
