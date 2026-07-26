import { Star, Send, Eye, ThumbsUp, CheckCircle, Clock } from 'lucide-react';

const config = {
  'Submitted': { color: 'text-blue-600', bg: 'bg-blue-50', icon: Send },
  'Under Review': { color: 'text-amber-600', bg: 'bg-amber-50', icon: Eye },
  'Acknowledged': { color: 'text-purple-600', bg: 'bg-purple-50', icon: ThumbsUp },
  'Resolved': { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
  'Closed': { color: 'text-gray-600', bg: 'bg-gray-100', icon: Clock }
};

export default function FeedbackCard({ fb, isSelected, onClick }) {
  const { color, bg, icon: SIcon } = config[fb.status] || config['Submitted'];

  return (
    <div onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all">
      <div className="flex items-center space-x-3 mb-2">
        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${color}`}>
          <SIcon size={10} /><span>{fb.status}</span>
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
      {isSelected && <FeedbackDetails fb={fb} />}
    </div>
  );
}

function FeedbackDetails({ fb }) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <p className="text-xs text-gray-400 mb-1">Full Message</p>
        <p className="text-gray-700 whitespace-pre-wrap">{fb.message}</p>
      </div>
      {fb.ceoResponse?.message ? (
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
          <p className="text-xs font-semibold text-cyan-600 mb-2">CEO Response</p>
          <p className="text-gray-700 whitespace-pre-wrap">{fb.ceoResponse.message}</p>
          <p className="text-xs text-gray-400 mt-2">Responded on {new Date(fb.ceoResponse.respondedAt).toLocaleDateString()}</p>
        </div>
      ) : fb.status === 'Submitted' ? (
        <p className="text-sm text-gray-500 italic">Your feedback is waiting to be reviewed by the CEO.</p>
      ) : null}
    </div>
  );
}
