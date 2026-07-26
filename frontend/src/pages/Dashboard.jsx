import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTreatmentStats } from '../store/slices/treatmentSlice';
import { fetchPaymentStats } from '../store/slices/paymentSlice';
import StatCards from '../components/dashboard/StatCards';
import QuickActions from '../components/dashboard/QuickActions';

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);
  const { stats } = useSelector((s) => s.treatments);
  const { stats: paymentStats } = useSelector((s) => s.payments);
  const dispatch = useDispatch();
  console.log(stats,"from dashboard")
  useEffect(() => {
    dispatch(fetchTreatmentStats());
    dispatch(fetchPaymentStats());
  }, [dispatch]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName}! 👋</h1>
        <p className="text-gray-600 mt-1">Here's an overview of your dental health journey</p>
      </div>
      <StatCards stats={stats} paymentStats={paymentStats} />
      <QuickActions stats={stats} paymentStats={paymentStats} />
    </div>
  );
}
