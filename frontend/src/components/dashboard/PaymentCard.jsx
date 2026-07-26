import { Calendar, DollarSign } from 'lucide-react';

export default function PaymentCard({ payment, isSelected, onClick }) {
  return (
    <div onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
            <DollarSign size={22} className="text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{payment.treatment?.name || 'Treatment'}</p>
            <p className="text-sm text-gray-500">{payment.treatment?.description || 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <div className="text-left md:text-right">
            <p className="text-xs text-gray-400">{new Date(payment.paymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            <p className="text-xs text-gray-400 mt-0.5">Receipt: {payment.receiptNumber}</p>
          </div>
          <div className="text-right min-w-[100px]">
            <p className="text-lg font-bold text-gray-900">${payment.paidAmount?.toLocaleString()}</p>
          </div>
        </div>
      </div>
      {isSelected && <PaymentDetails payment={payment} />}
    </div>
  );
}

function PaymentDetails({ payment }) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
      <div>
        <p className="text-gray-400 text-xs mb-1">Payment Method</p>
        <p className="font-medium text-gray-700">{payment.paymentMethod}</p>
      </div>
      <div>
        <p className="text-gray-400 text-xs mb-1">Processed By</p>
        <p className="font-medium text-gray-700">{payment.processedBy?.firstName} {payment.processedBy?.lastName || 'N/A'}</p>
      </div>
      {payment.notes && (
        <div>
          <p className="text-gray-400 text-xs mb-1">Notes</p>
          <p className="font-medium text-gray-700">{payment.notes}</p>
        </div>
      )}
    </div>
  );
}
