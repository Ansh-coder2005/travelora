import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 5.0, count, showCount = true, size = "w-4 h-4" }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.4;

  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
      <div className="flex items-center text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${size} ${
              i < fullStars
                ? "fill-amber-400 text-amber-400"
                : i === fullStars && hasHalf
                ? "fill-amber-400/50 text-amber-400"
                : "text-slate-300"
            }`}
          />
        ))}
      </div>
      <span className="font-bold text-navy-900">{rating.toFixed(1)}</span>
      {showCount && count && (
        <span className="text-slate-400 font-normal">({count})</span>
      )}
    </div>
  );
};
