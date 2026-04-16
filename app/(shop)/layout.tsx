import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { cookies } from "next/headers";
import { Providers } from "@/providers/Providers";

import HeaderNavigation from "@/components/navigation/HeaderNavigation";
import FooterNavigation from "@/components/navigation/FooterNavigation";

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

  const theme = cookieStore.get('project-theme')?.value || 'light';

  return (
    <html lang="en" className={sourceSans.className}>
      <body
        className={`antialiased dark:bg-ca-black dark:text-white transition-colors duration-300`}
      >
        <Providers initialTheme={theme}>
          
          <HeaderNavigation />
          
          <main>
            {children}
          </main>
          
          <FooterNavigation />
        
        </Providers>
      </body>
    </html>
  );
}
