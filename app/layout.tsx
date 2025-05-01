import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "./providers/Query/providers";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movies",
  description: "A simple movie app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-Br' suppressHydrationWarning>
      <body className={`${inter.className}  antialiased`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <QueryProvider>
          {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
