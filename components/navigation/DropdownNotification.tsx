"use client";

import type { ShopNotification } from "./useNotifications";

interface DropdownNotificationsProps {
    notifications: ShopNotification[];
    unreadCount: number;
    status: "loading" | "ready" | "error";
    isRead: (key: string) => boolean;
    onMarkAllRead: () => void;
}

const DropdownNotification = ({
    notifications,
    unreadCount,
    status,
    isRead,
    onMarkAllRead,
}: DropdownNotificationsProps) => {
    return (
        <div
            role="region"
            aria-label="Notifications"
            className="rounded-xl border border-ca-grey bg-white p-4 text-ca-black dark:border-white/20 dark:bg-ca-black dark:text-white"
        >
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold tracking-wide">Notifications</h2>
                <button
                    type="button"
                    onClick={onMarkAllRead}
                    disabled={unreadCount === 0 || status === "loading"}
                    className="cursor-pointer text-xs font-semibold underline underline-offset-2 hover:text-ca-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ca-orange disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Mark all as read
                </button>
            </div>
            {status === "loading" && (
                <p className={notifications.length > 0 ? "sr-only" : "mt-3 text-sm"} role="status">
                    Loading notifications...
                </p>
            )}
            {status === "error" && (
                <p className="mt-3 text-sm" role="status">Product notifications are temporarily unavailable.</p>
            )}
            {status === "ready" && notifications.length === 0 && (
                <p className="mt-3 text-sm text-ca-black/70 dark:text-white/70">You have no notifications.</p>
            )}
            {notifications.length > 0 && (
                <ul className="mt-3 max-h-80 divide-y divide-ca-grey/40 overflow-y-auto border-t border-ca-grey/40 dark:divide-white/10 dark:border-white/10">
                    {notifications.map(({ key, message }) => (
                        <li key={key} className="flex items-start gap-3 py-3 text-sm">
                            <span
                                aria-hidden="true"
                                className={`mt-1.5 size-2 shrink-0 rounded-full ${isRead(key) ? "bg-transparent" : "bg-ca-orange"}`}
                            />
                            <span className={isRead(key) ? "text-ca-black/65 dark:text-white/65" : "font-semibold"}>
                                {!isRead(key) && <span className="sr-only">Unread: </span>}
                                {message}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownNotification;
