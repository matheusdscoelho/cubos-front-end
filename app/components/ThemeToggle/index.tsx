"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className='p-2 text-sm rounded bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600'
    >
      {theme === "dark" ? <Sun/> : <Moon/>}
    </button>
  );
}
