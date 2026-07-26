import { MessageSquare, Star, User } from 'lucide-react';

export default function RecentFeedbacksList({ feedbacks }) {
  if (!feedbacks?.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Feedback</h2>
        <p className="text-gray-500 text-sm">No recent feedback</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Feedback</h2>
      <div className="space-y-4">
        {feedbacks.map((f, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <User size={14} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{f.patient?.firstName} {f.patient?.lastName}</p>
                  <p className="text-xs text-gray-500">{f.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={12} className={j < f.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
            </div>
            <p className="text-sm font-medium text-gray-800">{f.subject}</p>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{f.message}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
