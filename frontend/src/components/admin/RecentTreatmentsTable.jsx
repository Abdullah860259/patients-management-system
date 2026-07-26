export default function RecentTreatmentsTable({ treatments }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-gray-400">
            <th className="pb-2 pr-2 font-medium">Treatment</th>
            <th className="pb-2 pr-2 font-medium">Cost</th>
            <th className="pb-2 pr-2 font-medium">Duration</th>
          </tr>
        </thead>
        <tbody>
          {treatments?.map((t, i) => (
            <tr key={i} className="border-t border-gray-50">
              <td className="py-2 pr-2 text-gray-900 font-medium">{t.name}</td>
              <td className="py-2 pr-2 text-gray-900">${t.cost?.toLocaleString()}</td>
              <td className="py-2 pr-2 text-gray-600">{t.durationDays ? `${t.durationDays} days` : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
