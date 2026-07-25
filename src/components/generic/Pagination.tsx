interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxVisible = 6;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, "...", totalPages - 2, totalPages - 1, totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-[#475467] dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, i) =>
          page === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-[#475467]">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center text-sm rounded-full cursor-pointer ${
                currentPage === page
                  ? "bg-[#DBEAFE] dark:bg-indigo-950 text-[#1E40AF] dark:text-indigo-400 font-medium"
                  : "text-[#475467] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 cursor-pointer text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-[#475467] dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        Next
      </button>
    </div>
  );
}