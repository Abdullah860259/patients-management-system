import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminDashboard } from '../store/slices/adminSlice';
import AdminStatsCards from '../components/admin/AdminStatsCards';
import RecentTreatmentsTable from '../components/admin/RecentTreatmentsTable';
import RecentFeedbacksList from '../components/admin/RecentFeedbacksList';
import AdminQuickActions from '../components/admin/AdminQuickActions';

export default function AdminDashboard() {
  const { user } = useSelector((s) => s.auth);
  const { dashboard } = useSelector((s) => s.admin);
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminDashboard()).then(() => setLoaded(true));
  }, [dispatch]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'ceo' ? 'CEO Dashboard' : 'Admin Dashboard'}
          </h1>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${
            user?.role === 'ceo' ? 'bg-indigo-100 text-indigo-700' : 'bg-cyan-100 text-cyan-700'
          }`}>{user?.role === 'ceo' ? 'CEO' : 'Admin'}</span>
        </div>
        <p className="text-gray-600 mt-1">Welcome back, {user?.firstName}! Here's your clinic overview</p>
      </div>
      <AdminStatsCards stats={dashboard?.stats} isAdmin={user?.role === 'admin'} isCeo={user?.role === 'ceo'} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTreatmentsTable treatments={dashboard?.recentTreatments} />
        {user?.role === 'ceo' && <RecentFeedbacksList feedbacks={dashboard?.recentFeedbacks} />}
      </div>
      <AdminQuickActions />
    </div>
  );
}
