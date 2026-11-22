"use client";

import { useEffect, useState } from "react";

const OrderCreatedNotice = () => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete("created");
        window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);

        const timeoutId = window.setTimeout(() => setVisible(false), 6000);
        return () => window.clearTimeout(timeoutId);
    }, []);

    if (!visible) return null;

    return (
        <p role="status" className="mt-5 rounded-lg bg-emerald-100 p-4 text-sm font-medium text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
            Demo order created. No payment or shipment was made.
        </p>
    );
};

export default OrderCreatedNotice;
