import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllAdmins, createAdmin, updateAdmin, deleteAdmin } from '../store/slices/adminSlice';
import { Search, Plus, X, Pencil, Trash2, Shield, Mail, Phone, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminManagement() {
  const dispatch = useDispatch();
  const { admins } = useSelector((s) => s.admin);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', dateOfBirth: '', gender: 'male' });

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); dispatch(fetchAllAdmins({ search, page: 1 })); }, 400);
    return () => clearTimeout(timer);
  }, [search, dispatch]);

  useEffect(() => { dispatch(fetchAllAdmins({ search, page })); }, [page, dispatch]);

  const openCreate = () => { setEditing(null); setForm({ firstName: '', lastName: '', email: '', password: '', phone: '', dateOfBirth: '', gender: 'male' }); setShowModal(true); };

  const openEdit = (admin) => {
    setEditing(admin);
    setForm({
      firstName: admin.firstName, lastName: admin.lastName, email: admin.email,
      password: '', phone: admin.phone, dateOfBirth: admin.dateOfBirth?.split('T')[0] || '', gender: admin.gender
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      const data = { ...form };
      delete data.password;
      const res = await dispatch(updateAdmin({ id: editing._id, data }));
      if (res.meta.requestStatus === 'fulfilled') { toast.success('Admin updated'); setShowModal(false); dispatch(fetchAllAdmins({ search, page })); }
      else toast.error(res.payload?.message || 'Update failed');
    } else {
      const res = await dispatch(createAdmin(form));
      if (res.meta.requestStatus === 'fulfilled') { toast.success('Admin created'); setShowModal(false); dispatch(fetchAllAdmins({ search, page })); }
      else toast.error(res.payload?.message || 'Creation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    const res = await dispatch(deleteAdmin(id));
    if (res.meta.requestStatus === 'fulfilled') { toast.success('Admin deleted'); dispatch(fetchAllAdmins({ search, page })); }
    else toast.error(res.payload?.message || 'Delete failed');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Admins</h1>
          <p className="text-gray-600 mt-1">Create, update, and manage admin accounts</p>
        </div>
        <button onClick={openCreate}
          className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg">
          <Plus size={18} /><span>Add Admin</span>
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search admins..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Admin</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Phone</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Joined</th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.items?.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-12 text-gray-500">No admins found</td></tr>
              ) : (
                admins.items?.map((a, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-indigo-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                          <Shield size={16} className="text-white" />
                        </div>
                        <span className="font-medium text-gray-900">{a.firstName} {a.lastName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5 text-gray-600"><Mail size={14} /><span>{a.email}</span></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5 text-gray-600"><Phone size={14} /><span>{a.phone || '-'}</span></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5 text-gray-500">
                        <Calendar size={14} /><span>{new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => openEdit(a)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(a._id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {admins.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">Page {admins.currentPage} of {admins.totalPages} ({admins.total} total)</p>
          <div className="flex items-center space-x-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"><ChevronLeft size={18} /></button>
            <button disabled={page >= admins.totalPages} onClick={() => setPage(page + 1)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"><ChevronRight size={18} /></button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Admin' : 'Add New Admin'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              {!editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input type="date" required value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-md">
                {editing ? 'Update Admin' : 'Create Admin'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
