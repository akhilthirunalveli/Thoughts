"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import lzString from "lz-string";
import "@theme-toggles/react/css/Around.css"

import { Around } from "@theme-toggles/react"
import { Share2, Check } from "lucide-react";

export default function Home() {
    const [content, setContent] = useState("");
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [mounted, setMounted] = useState(false);

    const [copied, setCopied] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, []);

    useEffect(() => {
        adjustHeight();
    }, [content, adjustHeight]);

    useEffect(() => {
        window.addEventListener("resize", adjustHeight);
        return () => window.removeEventListener("resize", adjustHeight);
    }, [adjustHeight]);

    useEffect(() => {
        setMounted(true);

        if (typeof window !== "undefined") {
            const hash = window.location.hash.slice(1);
            if (hash) {
                try {
                    const decompressed = lzString.decompressFromEncodedURIComponent(hash);
                    if (decompressed) {
                        setContent(decompressed);
                    }
                } catch (e) {
                    console.error("Failed to decompress URL content", e);
                }
            } else {
                const saved = localStorage.getItem("thoughts-content");
                if (saved) setContent(saved);
            }

            const savedTheme = localStorage.getItem("thoughts-theme") as "light" | "dark";
            if (savedTheme) {
                setTheme(savedTheme);
                document.documentElement.classList.toggle("dark", savedTheme === "dark");
            } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                setTheme("dark");
                document.documentElement.classList.add("dark");
            }
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("thoughts-content", content);
        }
    }, [content, mounted]);

    const toggleTheme = async () => {
        const newTheme = theme === "light" ? "dark" : "light";

        // @ts-ignore
        if (!document.startViewTransition) {
            setTheme(newTheme);
            localStorage.setItem("thoughts-theme", newTheme);
            document.documentElement.classList.toggle("dark");
            return;
        }

        // @ts-ignore
        const transition = document.startViewTransition(() => {
            setTheme(newTheme);
            localStorage.setItem("thoughts-theme", newTheme);
            document.documentElement.classList.toggle("dark");
        });

        try {
            await transition.ready;

            const radius = Math.hypot(
                Math.max(window.innerWidth, window.innerHeight)
            );

            const clipPath = [
                `circle(0px at 40px 40px)`,
                `circle(${radius}px at 40px 40px)`
            ];

            document.documentElement.animate(
                {
                    clipPath: clipPath,
                },
                {
                    duration: 500,
                    easing: "ease-in-out",
                    pseudoElement: "::view-transition-new(root)",
                }
            );
        } catch (e) {
            console.error("View transition failed", e);
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    if (!mounted) return null;

    return (
        <main className="min-h-screen relative flex flex-col items-center justify-center p-4 transition-colors duration-300">
            <div className="absolute top-6 left-6 text-2xl z-50">
                {/* @ts-expect-error: Library types incompatibility with React 19 */}
                <Around
                    duration={750}
                    toggled={theme === "dark"}
                    toggle={toggleTheme}
                    className="opacity-80"
                />
            </div>

            <button
                onClick={handleShare}
                className="absolute top-6 right-6 z-50 text-[var(--foreground)] transition-opacity duration-300 hover:opacity-75 font-chillax text-lg"
                aria-label="Copy to clipboard"
            >
                {copied ? "Copied" : "Share"}
            </button>

            <div className="w-full max-w-3xl flex-1 flex flex-col pt-16 pb-10">
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start typing..."
                    className="flex-1 w-full bg-transparent resize-none outline-none border-none text-lg md:text-xl leading-relaxed placeholder:text-gray-400 dark:placeholder:text-gray-500 font-chillax overflow-hidden min-h-[50vh]"
                    spellCheck={false}
                    autoFocus
                />
            </div>
        </main>
    );
}
