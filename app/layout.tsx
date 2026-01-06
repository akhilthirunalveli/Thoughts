import type { Metadata } from "next";
import { Figtree, Lora, JetBrains_Mono } from "next/font/google"; // Import new fonts
import "./globals.css";
import { ControlPanel } from "./components/ControlPanel";

const figtree = Figtree({
    variable: "--font-figtree",
    subsets: ["latin"],
    display: "swap",
});

const lora = Lora({
    variable: "--font-lora",
    subsets: ["latin"],
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
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
                className={`${figtree.variable} ${lora.variable} ${jetbrainsMono.variable} font-sans antialiased transition-all duration-300`}
                suppressHydrationWarning
            >
                {children}
                <ControlPanel />
            </body>
        </html>
    );
}
