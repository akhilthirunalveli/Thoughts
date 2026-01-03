import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Changed import
import "./globals.css";

// Configured Geist font
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

// Configured Geist Mono font
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Thoughts",
    description: "Minimal minimalist markdown editor",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                suppressHydrationWarning
            >
                {children}
            </body>
        </html>
    );
}
