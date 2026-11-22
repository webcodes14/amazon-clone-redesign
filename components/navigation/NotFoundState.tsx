import Link from "next/link";
import ErrorState, { errorPrimaryAction } from "./ErrorState";

export default function NotFoundState() {
    return (
        <ErrorState
            label="404"
            title="Page not found"
            description="The page you're looking for doesn't exist or may have moved."
        >
            <Link href="/" className={errorPrimaryAction}>Back to home</Link>
        </ErrorState>
    );
}
