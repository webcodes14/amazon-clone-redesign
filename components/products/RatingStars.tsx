import { FaStar } from "react-icons/fa";

interface RatingStarsProps {
    rating: number;
    size?: "small" | "medium";
}

const RatingStars = ({ rating, size = "medium" }: RatingStarsProps) => {
    const normalizedRating = Number.isFinite(rating) ? Math.min(5, Math.max(0, rating)) : 0;
    const starSize = size === "small" ? "size-4" : "size-5";

    return (
        <span
            role="img"
            aria-label={`${normalizedRating.toFixed(1)} out of 5 stars`}
            className="inline-flex items-center gap-0.5"
        >
            {Array.from({ length: 5 }, (_, index) => {
                const fillPercentage = Math.min(1, Math.max(0, normalizedRating - index)) * 100;

                return (
                    <span key={index} aria-hidden="true" className={`relative inline-flex shrink-0 ${starSize}`}>
                        <FaStar className={`absolute inset-0 ${starSize} text-gray-300 dark:text-gray-600`} />
                        <span
                            className="absolute inset-y-0 left-0 overflow-hidden"
                            style={{ width: `${fillPercentage}%` }}
                        >
                            <FaStar className={`${starSize} text-amber-400`} />
                        </span>
                    </span>
                );
            })}
        </span>
    );
};

export default RatingStars;
