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
        // Reset State
        setTheme("light");
        setFontFamily("sans");
        setFontSize(18);

        // Reset Storage
        localStorage.removeItem("thoughts-theme");
        localStorage.removeItem("thoughts-font");
        localStorage.removeItem("thoughts-size");

        // Reset DOM
        document.documentElement.classList.remove("dark");
        updateFontVariable("sans");
        document.documentElement.style.setProperty("--font-size-base", "18px");
    };

    const toggleTheme = async () => {
        const newTheme = theme === "light" ? "dark" : "light";

        // Use View Transition API if available
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

        try {
            await transition.ready;
            const radius = Math.hypot(
                Math.max(window.innerWidth, window.innerHeight)
            );
            const clipPath = [
                `circle(0px at ${window.innerWidth}px 0px)`,
                `circle(${radius}px at ${window.innerWidth}px 0px)`
            ];

            document.documentElement.animate(
                { clipPath },
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all animate-in fade-in duration-200">
            <div
                className="w-full max-w-md bg-[var(--background)] border border-[var(--foreground)]/10 rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold font-sans">Control Panel</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={resetSettings}
                            className="p-2 hover:bg-[var(--foreground)]/5 rounded-full transition-colors text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
                            title="Reset to Defaults"
                            aria-label="Reset to Defaults"
                        >
                            <RotateCcw size={18} />
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-[var(--foreground)]/5 rounded-full transition-colors"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 transition-colors">
                        <div className="flex flex-col">
                            <span className="font-medium flex items-center gap-2"><Sun size={16} /> Theme</span>
                            <span className="text-sm text-[var(--foreground)]/60">
                                {theme === "light" ? "Light Mode" : "Dark Mode"}
                            </span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-3 bg-[var(--background)] shadow-sm rounded-full hover:scale-105 transition-transform"
                        >
                            {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>

                    {/* Font Family Selector */}
                    <div className="p-4 rounded-xl bg-[var(--foreground)]/5 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <Type size={16} />
                            <span className="font-medium">Font Style</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {(["sans", "serif", "mono"] as const).map((font) => (
                                <button
                                    key={font}
                                    onClick={() => handleFontChange(font)}
                                    className={`px-3 py-2 rounded-lg text-sm transition-all ${fontFamily === font
                                        ? "bg-[var(--foreground)] text-[var(--background)] shadow-sm"
                                        : "hover:bg-[var(--foreground)]/10"
                                        }`}
                                >
                                    {font.charAt(0).toUpperCase() + font.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Font Size Slider */}
                    <div className="p-4 rounded-xl bg-[var(--foreground)]/5 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <MoveVertical size={16} />
                                <span className="font-medium">Font Size</span>
                            </div>
                            <span className="text-sm text-[var(--foreground)]/60 bg-[var(--background)] px-2 py-0.5 rounded-md shadow-sm">
                                {fontSize}px
                            </span>
                        </div>
                        <input
                            type="range"
                            min="14"
                            max="32"
                            step="1"
                            value={fontSize}
                            onChange={handleFontSizeChange}
                            className="w-full accent-[var(--foreground)] h-2 bg-[var(--foreground)]/10 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                <div className="mt-6 text-center text-xs text-[var(--foreground)]/40">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--foreground)]/10">Esc</kbd> to close
                </div>
            </div>
        </div>
    );
}
