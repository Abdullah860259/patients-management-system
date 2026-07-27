import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAnalytics } from '../store/slices/adminSlice';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend, ComposedChart, Area } from 'recharts';
import { TrendingUp, Users, DollarSign, Star, CreditCard, Calendar } from 'lucide-react';

const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#14b8a6', '#f97316', '#84cc16'];

export default function Analytics() {
  const dispatch = useDispatch();
  const { analytics } = useSelector((s) => s.admin);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('revenue');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadAnalytics = useCallback(() => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    dispatch(fetchAnalytics(params.toString())).then(() => setLoaded(true));
  }, [dispatch, startDate, endDate]);

  useEffect(() => { loadAnalytics(); }, [loadAnalytics]);

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600" />
      </div>
    );
  }

  const avgRating = analytics?.feedbackRatings?.length
    ? (analytics.feedbackRatings.reduce((s, r) => s + r._id * r.count, 0) / analytics.feedbackRatings.reduce((s, r) => s + r.count, 0)).toFixed(1)
    : '0.0';

  const summaryCards = [
    { icon: DollarSign, label: 'Total Revenue', value: `$${(analytics?.totalRevenue || 0).toLocaleString()}`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: CreditCard, label: 'Total Payments', value: analytics?.totalPayments || 0, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { icon: Users, label: 'Total Patients', value: analytics?.totalPatients || 0, color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: TrendingUp, label: 'Treatments Offered', value: analytics?.totalTreatments || 0, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { icon: Star, label: 'Avg Rating', value: avgRating, color: 'text-yellow-600', bg: 'bg-yellow-50' }
  ];

  const tabs = [
    { key: 'revenue', label: 'Revenue' },
    { key: 'treatments', label: 'Treatments' },
    { key: 'payments', label: 'Payments' },
    { key: 'patients', label: 'Patients' },
    { key: 'feedback', label: 'Feedback' },
    { key: 'staff', label: 'Staff' }
  ];

  const revenueChart = (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={analytics?.revenueByMonth || []}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
          <Bar dataKey="revenue" fill="#06b6d4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const paymentCountChart = (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Count by Month</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={analytics?.paymentCountByMonth || []}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const methodTrendData = (() => {
    const map = {};
    (analytics?.paymentMethodOverTime || []).forEach(d => {
      if (!map[d._id.month]) map[d._id.month] = {};
      map[d._id.month][d._id.method] = d.count;
    });
    return Object.entries(map).map(([month, methods]) => ({ month, ...methods }));
  })();

  const methodNames = [...new Set((analytics?.paymentMethodOverTime || []).map(d => d._id.method))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive clinic performance data</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <Calendar size={16} className="text-gray-400" />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="text-sm outline-none w-28 sm:w-32" />
            <span className="text-gray-400">—</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="text-sm outline-none w-28 sm:w-32" />
          </div>
          {(startDate || endDate) && (
            <button onClick={handleClear} className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2">Clear</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {summaryCards.map(({ icon: Icon, label, value, color, bg }, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
              </div>
              <div className={`${bg} w-11 h-11 rounded-xl flex items-center justify-center`}>
                <Icon size={20} className={color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit flex-wrap">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
              activeTab === tab.key ? 'bg-white text-cyan-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>{tab.label}</button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'revenue' && (<>{revenueChart}{paymentCountChart}</>)}

        {activeTab === 'treatments' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Most Booked Treatments</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={analytics?.treatmentPopularity || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => `${v} booking(s)`} />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Treatment</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={analytics?.treatmentRevenue || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                    <Bar dataKey="total" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Bookings & Revenue by Treatment</h2>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={analytics?.treatmentPopularity || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, angle: -30, textAnchor: 'end' }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="count" fill="#8b5cf6" radius={[2, 2, 0, 0]} name="Bookings" />
                  <Line yAxisId="right" type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} name="Revenue" dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeTab === 'payments' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods by Revenue</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={analytics?.paymentMethodDist || []} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label={({ _id, percent }) => `${_id} (${(percent * 100).toFixed(0)}%)`}>
                      {(analytics?.paymentMethodDist || []).map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                    </Pie>
                    <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods by Count</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={analytics?.paymentMethodDist || []} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label={({ _id, percent }) => `${_id} (${(percent * 100).toFixed(0)}%)`}>
                      {(analytics?.paymentMethodDist || []).map((_, i) => (<Cell key={i} fill={COLORS[(i + 4) % COLORS.length]} />))}
                    </Pie>
                    <Tooltip formatter={(v) => `${v} payment(s)`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method Trends Over Time</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={methodTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  {methodNames.map((method, i) => (
                    <Line key={method} type="monotone" dataKey={method} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 2 }} name={method} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeTab === 'patients' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Growth Over Time</h2>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={analytics?.patientGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => `${v} patient(s)`} />
                  <Area type="monotone" dataKey="count" stroke="#06b6d4" fill="#cffafe" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={analytics?.patientGenderDist || []} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label={({ _id, percent }) => `${_id} (${(percent * 100).toFixed(0)}%)`}>
                    {(analytics?.patientGenderDist || []).map((_, i) => (<Cell key={i} fill={['#06b6d4', '#ec4899', '#a1a1aa'][i]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics?.feedbackRatings || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="_id" tick={{ fontSize: 12 }} label={{ value: 'Rating', position: 'bottom' }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => `${v} feedback(s)`} />
                    <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Feedback by Category</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={analytics?.feedbackByCategory || []} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label={({ _id, percent }) => `${_id} (${(percent * 100).toFixed(0)}%)`}>
                      {(analytics?.feedbackByCategory || []).map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Feedback Count & Avg Rating Over Time</h2>
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={analytics?.feedbackByMonth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 5]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="count" fill="#8b5cf6" radius={[2, 2, 0, 0]} name="Count" />
                  <Line yAxisId="right" type="monotone" dataKey="avgRating" stroke="#f59e0b" strokeWidth={2} name="Avg Rating" dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeTab === 'staff' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Staff</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics?.adminRevenue || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                    <Bar dataKey="revenue" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payments Processed</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics?.adminPaymentCount || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => `${v} payment(s)`} />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Patients Created</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics?.adminPatientsCreated || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => `${v} patient(s)`} />
                    <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Staff Payment Method Breakdown</h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={(() => {
                  const map = {};
                  (analytics?.adminMethodBreakdown || []).forEach(d => {
                    if (!map[d.name]) map[d.name] = { name: d.name };
                    map[d.name][d.method] = (map[d.name][d.method] || 0) + d.revenue;
                  });
                  return Object.values(map);
                })()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                  <Legend />
                  {[...new Set((analytics?.adminMethodBreakdown || []).map(d => d.method))].map((method, i) => (
                    <Bar key={method} dataKey={method} stackId="a" fill={COLORS[i % COLORS.length]} name={method} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
