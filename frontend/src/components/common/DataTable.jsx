import EmptyState from './EmptyState';

export default function DataTable({
  columns,
  data,
  onRowClick,
  selectedIds = [],
  onSelect,
  emptyTitle,
  emptyDescription,
}) {
  const selectable = !!onSelect;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {selectable && (
              <th className="px-3 py-2.5 text-left w-10">
                <input
                  type="checkbox"
                  checked={data.length > 0 && selectedIds.length === data.length}
                  onChange={(e) => {
                    onSelect(e.target.checked ? data.map((d) => d.id) : []);
                  }}
                  className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-2.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider ${
                  col.className || ''
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)}>
                <EmptyState title={emptyTitle} description={emptyDescription} />
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={`hover:bg-neutral-50 transition-colors duration-150 ${
                  onRowClick ? 'cursor-pointer' : ''
                } ${selectedIds.includes(row.id) ? 'bg-primary-50/50' : ''}`}
              >
                {selectable && (
                  <td className="px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onSelect([...selectedIds, row.id]);
                        } else {
                          onSelect(selectedIds.filter((id) => id !== row.id));
                        }
                      }}
                      className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className={`px-3 py-2.5 text-neutral-700 ${col.className || ''}`}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
