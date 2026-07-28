import { FiStar } from "react-icons/fi";

interface StarRatingProps {
  rating: number;
  size?: string;
}

export default function StarRating({ rating, size = "w-4 h-4" }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const fillPercent = Math.max(0, Math.min(1, rating - i)) * 100;
        return (
          <span key={i} className={`relative ${size}`}>
            <FiStar className={`absolute inset-0 ${size} text-gray-200`} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
              <FiStar className={`${size} fill-[#FDB022] text-[#FDB022]`} />
            </span>
          </span>
        );
      })}
    </div>
  );
}