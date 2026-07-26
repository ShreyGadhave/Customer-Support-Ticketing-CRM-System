// TableSkeleton — shown while fetching ticket data.
// Renders shimmer rows matching the table column layout from the mockup.

const ROWS = 5;

// Column widths for each table column: ID, Customer, Subject, Priority, Status, Date
const COL_WIDTHS = ["w-16", "w-32", "w-48", "w-16", "w-16", "w-20"];

export default function TableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        {/* Faded header */}
        <thead>
          <tr className="text-[11px] font-bold text-ink-400 uppercase tracking-widest bg-[#fcfcfd] border-b border-[#f1f1f3]">
            <th className="py-4 px-6">Ticket ID</th>
            <th className="py-4 px-4">Customer</th>
            <th className="py-4 px-4">Subject</th>
            <th className="py-4 px-4">Priority</th>
            <th className="py-4 px-4">Status</th>
            <th className="py-4 px-6 text-right">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f1f1f3]">
          {Array.from({ length: ROWS }).map((_, rowIdx) => (
            <tr
              key={rowIdx}
              className={rowIdx % 2 !== 0 ? "bg-[#fcfcfd]/30" : ""}
            >
              {COL_WIDTHS.map((w, colIdx) => (
                <td
                  key={colIdx}
                  className={`py-4 ${colIdx === 0 ? "px-6" : "px-4"}`}
                >
                  {/* Customer column gets an avatar circle + name bar */}
                  {colIdx === 1 ? (
                    <div className="flex items-center gap-3">
                      <div className="skeleton w-7 h-7 rounded-full shrink-0" />
                      <div className={`skeleton h-4 ${w} rounded`} />
                    </div>
                  ) : (
                    <div
                      className={`skeleton h-4 ${w} rounded ${
                        colIdx === COL_WIDTHS.length - 1 ? "ml-auto" : ""
                      }`}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
