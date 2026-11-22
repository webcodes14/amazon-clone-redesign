import { NextResponse, type NextRequest } from "next/server";
import { getSafeRedirectPath } from "@/lib/auth-redirect";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    const next = request.nextUrl.searchParams.get("next");
    const destination = next === "/auth/reset-password" ? next : getSafeRedirectPath(next);

    if (!code) {
        return new NextResponse(null, { status: 303, headers: { Location: "/auth?error=missing-code" } });
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        return new NextResponse(null, { status: 303, headers: { Location: "/auth?error=confirmation-failed" } });
    }

    return new NextResponse(null, { status: 303, headers: { Location: destination } });
}
