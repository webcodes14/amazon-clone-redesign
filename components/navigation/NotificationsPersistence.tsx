"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hydrateReadNotifications } from "@/redux/notificationsSlice";
import type { AppDispatch, RootState } from "@/redux/store";

const STORAGE_KEY = "stock-pulse-read-notifications";

const NotificationsPersistence = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { readKeys, isHydrated } = useSelector((state: RootState) => state.notifications);

    useEffect(() => {
        let savedKeys: string[] = [];
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored !== null) {
                const parsed: unknown = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.every((key) => typeof key === "string")) {
                    savedKeys = parsed;
                } else {
                    console.error("Ignoring invalid saved notification data.");
                }
            }
        } catch (error) {
            console.error("Could not restore read notifications.", error);
        }
        dispatch(hydrateReadNotifications(savedKeys));
    }, [dispatch]);

    useEffect(() => {
        if (!isHydrated) return;
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(readKeys));
        } catch (error) {
            console.error("Could not save read notifications.", error);
        }
    }, [readKeys, isHydrated]);

    return null;
};

export default NotificationsPersistence;
