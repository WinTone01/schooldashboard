import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { ThemeProvider } from "@/components/theme-provider";
import { FaviconUpdater } from "@/components/favicon-updater";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ders Sayacı",
  description: "Okul Televizyonu Dashboard",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AppProvider>
            <FaviconUpdater />
            {children}
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
