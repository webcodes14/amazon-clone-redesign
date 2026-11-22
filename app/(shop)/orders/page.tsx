import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isMissingAuthSession } from "@/lib/auth-errors";
import CancelDemoOrderButton from "@/components/orders/CancelDemoOrderButton";
import OrderCreatedNotice from "@/components/orders/OrderCreatedNotice";

interface DemoOrderItem {
    id: string;
    title: string;
    quantity: number;
    unit_price: number | string;
}

interface DemoOrder {
    id: string;
    status: string;
    total: number | string;
    created_at: string;
    demo_order_items: DemoOrderItem[];
}

interface OrdersPageProps {
    searchParams: Promise<{ created?: string }>;
}

const formatStatus = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isDemoOrderItem = (value: unknown): value is DemoOrderItem =>
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.quantity === "number" &&
    Number.isInteger(value.quantity) &&
    (typeof value.unit_price === "number" || typeof value.unit_price === "string") &&
    Number.isFinite(Number(value.unit_price));

const isDemoOrder = (value: unknown): value is DemoOrder =>
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.status === "string" &&
    (typeof value.total === "number" || typeof value.total === "string") &&
    Number.isFinite(Number(value.total)) &&
    typeof value.created_at === "string" &&
    Array.isArray(value.demo_order_items) &&
    value.demo_order_items.every(isDemoOrderItem);

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
    const params = await searchParams;
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError && !isMissingAuthSession(userError)) {
        throw new Error(`Could not verify the current user: ${userError.message}`);
    }
    if (!user) {
        redirect("/auth?next=/orders");
    }

    const { data, error } = await supabase
        .from("demo_orders")
        .select("id, status, total, created_at, demo_order_items(id, title, quantity, unit_price)")
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(`Could not load demo orders: ${error.message}`);
    }

    if (!Array.isArray(data) || !data.every(isDemoOrder)) {
        throw new Error("The demo orders query returned invalid data.");
    }
    const orders = data;

    return (
        <section className="w-full px-4 py-8 sm:px-6 lg:pr-8 min-[992px]:-ml-16 min-[992px]:w-[calc(100%+4rem)] min-[992px]:pl-16 lg:pl-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">My demo orders</h1>
                    <p className="mt-2 text-sm text-ca-black/70 dark:text-white/70">
                        Only orders belonging to your signed-in account are shown.
                    </p>
                </div>
                <Link href="/account" className="font-semibold underline underline-offset-2 hover:text-ca-orange">
                    My account
                </Link>
            </div>

            {params.created === "1" && <OrderCreatedNotice />}

            {orders.length === 0 ? (
                <div className="mt-8 rounded-xl border border-ca-grey/50 p-6 text-center dark:border-white/20">
                    <h2 className="text-xl font-bold">No orders yet</h2>
                    <p className="mt-2 text-sm text-ca-black/70 dark:text-white/70">
                        Place a demo order from checkout to see how order history works.
                    </p>
                    <Link href="/all-products" className="mt-4 inline-flex font-semibold underline underline-offset-2 hover:text-ca-orange">
                        Browse products
                    </Link>
                </div>
            ) : (
                <ul className="mt-8 space-y-5">
                    {orders.map((order) => (
                        <li key={order.id} className="rounded-xl border border-ca-grey/50 p-5 dark:border-white/20">
                            <div className="flex flex-wrap justify-between gap-3">
                                <div>
                                    <h2 className="font-bold">Demo order #{order.id.slice(0, 8).toUpperCase()}</h2>
                                    <p className="mt-1 text-sm text-ca-black/65 dark:text-white/65">
                                        {new Date(order.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">${Number(order.total).toFixed(2)}</p>
                                    <p className={`mt-1 text-sm ${order.status === "cancelled" ? "text-ca-black/65 dark:text-white/65" : "text-emerald-700 dark:text-emerald-300"}`}>
                                        {formatStatus(order.status)}
                                    </p>
                                </div>
                            </div>
                            <ul className="mt-4 space-y-2 border-t border-ca-grey/30 pt-4 text-sm dark:border-white/10">
                                {order.demo_order_items.map((item) => (
                                    <li key={item.id} className="flex justify-between gap-4">
                                        <span>{item.title} × {item.quantity}</span>
                                        <span className="shrink-0">${(Number(item.unit_price) * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs leading-5 text-ca-black/60 dark:text-white/60">
                                Demo status only. This order will not be packed or shipped.
                            </p>
                            {order.status === "received" && <CancelDemoOrderButton orderId={order.id} />}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
