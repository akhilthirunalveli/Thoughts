"use client";

import { useEffect, useState } from "react";
import { X, Moon, Sun, Type, MoveVertical, RotateCcw } from "lucide-react";

export function ControlPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [fontFamily, setFontFamily] = useState<"sans" | "serif" | "mono">("sans");
    const [fontSize, setFontSize] = useState(18);

    useEffect(() => {
        // Initialize settings
        const savedTheme = localStorage.getItem("thoughts-theme") as "light" | "dark";
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark");
        }

        const savedFont = localStorage.getItem("thoughts-font") as "sans" | "serif" | "mono";
        if (savedFont) {
            setFontFamily(savedFont);
            updateFontVariable(savedFont);
        }

        const savedSize = localStorage.getItem("thoughts-size");
        if (savedSize) {
            const size = parseInt(savedSize);
            setFontSize(size);
            document.documentElement.style.setProperty("--font-size-base", `${size}px`);
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "/") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    const updateFontVariable = (font: "sans" | "serif" | "mono") => {
        const variableMap = {
            sans: "var(--font-figtree)",
            serif: "var(--font-lora)",
            mono: "var(--font-jetbrains-mono)",
        };
        document.documentElement.style.setProperty("--font-current", variableMap[font]);
    };

    const handleFontChange = (font: "sans" | "serif" | "mono") => {
        setFontFamily(font);
        localStorage.setItem("thoughts-font", font);
        updateFontVariable(font);
    };

    const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const size = parseInt(e.target.value);
        setFontSize(size);
        localStorage.setItem("thoughts-size", size.toString());
        document.documentElement.style.setProperty("--font-size-base", `${size}px`);
    };

    const resetSettings = () => {
        setTheme("light");
        setFontFamily("sans");
        setFontSize(18);
        localStorage.removeItem("thoughts-theme");
        localStorage.removeItem("thoughts-font");
        localStorage.removeItem("thoughts-size");
        document.documentElement.classList.remove("dark");
        updateFontVariable("sans");
        document.documentElement.style.setProperty("--font-size-base", "18px");
    };

    const toggleTheme = (newTheme: "light" | "dark") => {
        if (theme === newTheme) return;

        // @ts-ignore
        if (!document.startViewTransition) {
            setTheme(newTheme);
            localStorage.setItem("thoughts-theme", newTheme);
            document.documentElement.classList.toggle("dark", newTheme === "dark");
            return;
        }

        // @ts-ignore
        const transition = document.startViewTransition(() => {
            setTheme(newTheme);
            localStorage.setItem("thoughts-theme", newTheme);
            document.documentElement.classList.toggle("dark", newTheme === "dark");
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-neutral-900/20 dark:bg-black/40 transition-opacity animate-in fade-in duration-200"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div
                className="w-full max-w-[340px] relative z-10 overflow-hidden rounded-xl bg-white dark:bg-[#111] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-200/60 dark:border-neutral-800 transition-all animate-in zoom-in-95 fade-in duration-200 slide-in-from-bottom-2"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400">
                        Preferences
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={resetSettings}
                            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            title="Reset"
                        >
                            <RotateCcw size={13} strokeWidth={2} />
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                            <X size={14} strokeWidth={2} />
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-5">
                    {/* Theme */}
                    <div className="flex items-center justify-between">
                        <label className="text-[13px] font-medium text-neutral-900 dark:text-neutral-200">
                            Appearance
                        </label>
                        <div className="flex bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-700/50">
                            <button
                                onClick={() => toggleTheme("light")}
                                className={`px-3 py-1 rounded-md text-[13px] font-medium transition-all ${theme === 'light'
                                        ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/50'
                                        : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
                                    }`}
                            >
                                Light
                            </button>
                            <button
                                onClick={() => toggleTheme("dark")}
                                className={`px-3 py-1 rounded-md text-[13px] font-medium transition-all ${theme === 'dark'
                                        ? 'bg-[#222] text-white shadow-sm border border-white/5'
                                        : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
                                    }`}
                            >
                                Dark
                            </button>
                        </div>
                    </div>

                    {/* Font Family */}
                    <div className="space-y-2.5">
                        <label className="text-[13px] font-medium text-neutral-900 dark:text-neutral-200">
                            Typography
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(["sans", "serif", "mono"] as const).map((font) => (
                                <button
                                    key={font}
                                    onClick={() => handleFontChange(font)}
                                    className={`px-3 py-2 rounded-lg text-[13px] font-medium border transition-all ${fontFamily === font
                                            ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white shadow-sm"
                                            : "bg-white dark:bg-[#111] text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                                        }`}
                                >
                                    <span className={font === 'serif' ? 'font-serif' : font === 'mono' ? 'font-mono' : 'font-sans'}>
                                        {font.charAt(0).toUpperCase() + font.slice(1)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Font Size */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-[13px] font-medium text-neutral-900 dark:text-neutral-200">
                                Size
                            </label>
                            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700/50">
                                {fontSize}px
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Type size={12} className="text-neutral-400" />
                            <input
                                type="range"
                                min="14"
                                max="32"
                                step="1"
                                value={fontSize}
                                onChange={handleFontSizeChange}
                                className="flex-1 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-900 dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/20 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                            />
                            <Type size={16} className="text-neutral-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 p-2 text-center">
                    <p className="text-[10px] text-neutral-400 font-medium tracking-tight">Version 1.0</p>
                </div>
            </div>
        </div>
    );
}
