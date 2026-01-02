import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const chillax = localFont({
    src: "./fonts/Chillax-Regular.woff",
    variable: "--font-chillax",
    weight: "100 900",
    display: "swap",
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
                className={`${chillax.variable} antialiased`}
                suppressHydrationWarning
            >
                {children}
            </body>
        </html>
    );
}
