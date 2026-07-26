import { Star } from 'lucide-react';

export default function FeedbackOverview({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">Total Feedbacks</p>
        <p className="text-2xl font-bold text-cyan-600 mt-1">{stats.totalFeedbacks}</p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">Average Rating</p>
        <div className="flex items-center space-x-2 mt-1">
          <p className="text-2xl font-bold text-amber-500">{stats.averageRating}</p>
          <Star size={22} className="text-amber-400 fill-current" />
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-3">Top Categories</p>
        <div className="space-y-1.5">
          {stats.byCategory?.slice(0, 3).map((cat, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{cat._id}</span>
              <span className="text-gray-400">{cat.count} ({cat.avgRating?.toFixed(1)}★)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
