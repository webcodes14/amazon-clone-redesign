import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { cookies } from "next/headers";
import { Providers } from "@/providers/Providers";

import HeaderNavigation from "@/components/navigation/HeaderNavigation";
import FooterNavigation from "@/components/navigation/FooterNavigation";
import OfflineNotice from "@/components/navigation/OfflineNotice";
import { getCategories } from "@/lib/categories";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { isMissingAuthSession } from "@/lib/auth-errors";

import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stock Pulse",
  description: "Free shipping on millions of items. Get the best of Shopping and Entertainment with Prime.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  const savedTheme = cookieStore.get('project-theme')?.value;
  const theme = savedTheme === 'dark' ? 'dark' : 'light';
  const [categories, supabase] = await Promise.all([getCategories(), createSupabaseServerClient()]);
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error && !isMissingAuthSession(error)) {
    throw new Error(`Could not load the current user: ${error.message}`);
  }
  const initialUser = user
    ? { id: user.id, email: user.email ?? null, isAnonymous: user.is_anonymous === true }
    : null;

  return (
    <html lang="en" className={`${sourceSans.className} ${theme}`}>
      <body
        className={`antialiased dark:bg-ca-black dark:text-white transition-colors duration-300`}
      >
        <Providers initialTheme={theme} initialUser={initialUser}>
          <HeaderNavigation categories={categories} />

          <main className="mx-auto max-w-fhd pt-44 pb-24 md:pl-16 md:pt-16 md:pb-16">
            {children}
          </main>

          <FooterNavigation />
        </Providers>
        <OfflineNotice />
      </body>
    </html>
  );
}
