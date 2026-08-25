interface TableLoadingStateProps {
  colSpan: number;
  rows?: number;
}

export default function TableLoadingState({ colSpan, rows = 5 }: TableLoadingStateProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr
          key={rowIndex}
          className="border-b border-gray-50 dark:border-gray-800/50"
        >
          {Array.from({ length: colSpan }).map((_, cellIndex) => (
            <td key={cellIndex} className="px-4 py-3">
              <div
                className="h-4 rounded animate-pulse bg-gray-200 dark:bg-gray-700"
                style={{ width: cellIndex === 1 ? "70%" : "50%" }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}