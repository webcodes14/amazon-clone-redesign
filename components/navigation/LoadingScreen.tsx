import { FaAmazon } from "react-icons/fa";

interface LoadingScreenProps {
    isRouteFallback?: boolean;
}

const LoadingScreen = ({ isRouteFallback = false }: LoadingScreenProps) => (
    <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        data-route-loading={isRouteFallback ? "true" : undefined}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-white text-ca-black dark:bg-ca-black dark:text-white"
    >
        <span className="sr-only">Loading page</span>
        <div aria-hidden="true" className="relative flex h-32 w-32 items-center justify-center">
            <FaAmazon className="shop-loading__mark h-16 w-16" />
            <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full"
                fill="none"
            >
                <circle
                    className="shop-loading__ring"
                    cx="50"
                    cy="50"
                    r="46"
                    stroke="currentColor"
                    strokeWidth="2.5"
                />
                <circle
                    className="shop-loading__progress"
                    cx="50"
                    cy="50"
                    r="46"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    </div>
);

export default LoadingScreen;
