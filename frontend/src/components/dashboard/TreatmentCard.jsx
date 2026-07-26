import { DollarSign } from 'lucide-react';

export default function TreatmentCard({ treatment, isSelected, onClick }) {
  return (
    <div onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{treatment.name}</p>
          {treatment.description && (
            <p className="text-sm text-gray-500 mt-1">{treatment.description}</p>
          )}
          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
            {treatment.durationDays ? <span>{treatment.durationDays} days</span> : null}
            {treatment.minimumAdvanceAmount ? <span>Advance: ${treatment.minimumAdvanceAmount}</span> : null}
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="text-lg font-bold text-cyan-600">${treatment.cost?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
