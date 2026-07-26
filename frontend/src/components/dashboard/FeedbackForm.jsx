import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitFeedback, fetchFeedbacks, fetchFeedbackStats } from '../../store/slices/feedbackSlice';
import toast from 'react-hot-toast';
import { Send, Star } from 'lucide-react';

const categories = [
  'General', 'Service Quality', 'Staff Behavior', 'Cleanliness', 'Wait Time',
  'Pricing', 'Facilities', 'Treatment Experience', 'Recommendation', 'Complaint', 'Suggestion'
];

const initial = { category: 'General', subject: '', message: '', rating: 5, isAnonymous: false };

export default function FeedbackForm({ onClose }) {
  const [form, setForm] = useState(initial);
  const dispatch = useDispatch();
  const { submitting } = useSelector((s) => s.feedback);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(submitFeedback(form));
    if (submitFeedback.fulfilled.match(result)) {
      toast.success('Feedback submitted! Thank you for helping us improve.');
      setForm(initial);
      onClose();
      dispatch(fetchFeedbacks({}));
      dispatch(fetchFeedbackStats());
    } else {
      toast.error(result.payload?.message || 'Failed to submit feedback');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
        <Send size={22} className="text-cyan-600" />
        <span>Share Your Feedback</span>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
            <input type="text" required maxLength={200}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white"
              placeholder="Brief subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Message to the CEO</label>
          <textarea required rows={4} maxLength={2000}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none bg-gray-50 focus:bg-white"
            placeholder="Share your detailed experience or suggestions..."
            value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <p className="text-xs text-gray-400 mt-1">{form.message.length}/2000</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rate Your Experience</label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })} className="transition-transform hover:scale-110">
                <Star size={32} className={s <= form.rating ? 'text-amber-400 fill-current' : 'text-gray-300'} />
              </button>
            ))}
            <span className="ml-3 text-sm text-gray-500">{form.rating}/5</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <input type="checkbox" id="anon" checked={form.isAnonymous}
            onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
            className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500" />
          <label htmlFor="anon" className="text-sm text-gray-600">Submit anonymously</label>
        </div>
        <div className="flex space-x-3">
          <button type="button" onClick={onClose}
            className="px-6 py-2.5 border-2 border-gray-200 rounded-xl text-gray-600 font-medium hover:border-gray-300">Cancel</button>
          <button type="submit" disabled={submitting}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-2.5 rounded-xl font-semibold shadow-md disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
}
