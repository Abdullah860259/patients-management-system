import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFeedbacks, fetchFeedbackStats } from '../store/slices/feedbackSlice';
import { fetchAllFeedbacks, respondToFeedback } from '../store/slices/adminSlice';
import FeedbackForm from '../components/dashboard/FeedbackForm';
import FeedbackOverview from '../components/dashboard/FeedbackOverview';
import { Filter, ChevronDown, MessageSquare, Send, User, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Feedback() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items: patientItems, totalPages: ptPages, stats, loading: ptLoading } = useSelector((s) => s.feedback);
  const { feedbacks: adminData, loading: adLoading } = useSelector((s) => s.admin);
  const isAdmin = user?.role === 'admin' || user?.role === 'ceo';
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const [respondText, setRespondText] = useState({});

  const items = isAdmin ? adminData.items : patientItems;
  const totalPages = isAdmin ? adminData.totalPages : ptPages;
  const loading = isAdmin ? adLoading : ptLoading;

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchAllFeedbacks({ status: filter, page }));
    } else {
      dispatch(fetchFeedbacks({ status: filter, page }));
    }
  }, [dispatch, filter, page, isAdmin]);

  useEffect(() => {
    if (!isAdmin) dispatch(fetchFeedbackStats());
  }, [dispatch, isAdmin]);

  const handleRespond = async (fbId) => {
    const msg = respondText[fbId]?.trim();
    if (!msg) return;
    await dispatch(respondToFeedback({ id: fbId, message: msg }));
    setRespondText((prev) => ({ ...prev, [fbId]: '' }));
    dispatch(fetchAllFeedbacks({ status: filter, page }));
  };

  const statusColor = (status) => {
    const map = {
      Submitted: 'bg-blue-100 text-blue-700',
      'Under Review': 'bg-amber-100 text-amber-700',
      Acknowledged: 'bg-purple-100 text-purple-700',
      Resolved: 'bg-emerald-100 text-emerald-700',
      Closed: 'bg-gray-100 text-gray-700'
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback Center</h1>
          <p className="text-gray-600 mt-1">
            {isAdmin ? 'Review and respond to patient feedback' : 'Share your experience and help us improve'}
          </p>
        </div>
        {!isAdmin && (
          <button onClick={() => setShowForm(!showForm)}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg">
            <MessageSquare size={18} /><span>Send Feedback to CEO</span>
          </button>
        )}
      </div>

      {!isAdmin && showForm && <FeedbackForm onClose={() => setShowForm(false)} />}
      {!isAdmin && <FeedbackOverview stats={stats} />}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {isAdmin ? 'All Patient Feedback' : 'Your Feedback'}
        </h2>
        <div className="relative mt-4 md:mt-0">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none bg-white appearance-none">
            <option value="">All Status</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600" />
        </div>
      ) : items?.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Feedback Yet</h3>
          <p className="text-gray-500 mb-4">{isAdmin ? 'No feedback has been submitted' : 'Your feedback helps us improve our services'}</p>
          {!isAdmin && <button onClick={() => setShowForm(true)} className="text-cyan-600 font-medium hover:text-cyan-700">Send your first feedback →</button>}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((fb) => (
              <div key={fb._id} onClick={() => setExpanded(expanded?._id === fb._id ? null : fb)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all">
                {isAdmin && (
                  <div className="flex items-center space-x-2 mb-3 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">{fb.patient?.firstName?.[0]}{fb.patient?.lastName?.[0]}</span>
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{fb.patient?.firstName} {fb.patient?.lastName}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(fb.status)}`}>
                    <span>{fb.status}</span>
                  </span>
                  <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 rounded-full">{fb.category}</span>
                  <div className="flex items-center space-x-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={12} className={i < fb.rating ? 'text-amber-400 fill-current' : 'text-gray-300'} />
                    ))}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{fb.subject}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{fb.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(fb.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  {fb.isAnonymous && ' • Anonymous'}
                </p>

                {expanded?._id === fb._id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <p className="text-xs text-gray-400 mb-1">Full Message</p>
                      <p className="text-gray-700 whitespace-pre-wrap">{fb.message}</p>
                    </div>

                    {fb.ceoResponse?.message ? (
                      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200 mb-4">
                        <p className="text-xs font-semibold text-cyan-600 mb-2">CEO Response</p>
                        <p className="text-gray-700 whitespace-pre-wrap">{fb.ceoResponse.message}</p>
                        <p className="text-xs text-gray-400 mt-2">Responded on {new Date(fb.ceoResponse.respondedAt).toLocaleDateString()}</p>
                      </div>
                    ) : null}

                    {isAdmin && fb.status === 'Submitted' && (
                      <div className="mt-4">
                        <textarea value={respondText[fb._id] || ''} onChange={(e) => setRespondText((prev) => ({ ...prev, [fb._id]: e.target.value }))}
                          placeholder="Write your response as CEO..."
                          className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                          rows={3} onClick={(e) => e.stopPropagation()} />
                        <button onClick={(e) => { e.stopPropagation(); handleRespond(fb._id); }}
                          disabled={!respondText[fb._id]?.trim()}
                          className="mt-2 inline-flex items-center space-x-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                          <Send size={14} /><span>Send Response</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
              <div className="flex items-center space-x-2">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"><ChevronLeft size={18} /></button>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"><ChevronRight size={18} /></button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
