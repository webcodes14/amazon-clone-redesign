import NotFoundState from "@/components/navigation/NotFoundState";
import "./(shop)/globals.css";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-white font-sans text-ca-black">
            <NotFoundState />
        </main>
    );
}
