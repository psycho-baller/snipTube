import { useTheme } from "next-themes";
import Image from "next/image";
import styles from "./Styles.module.css";
import { cn } from "~lib/utils";

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      aria-label="theme toggler"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10"
      // className="bg-gray-2 dark:bg-dark-bg flex cursor-pointer items-center justify-center rounded-full text-black dark:text-white mr-1.5 absolute lg:static right-17"
    >
      <svg
        className={cn(
          "w-full px-2 text-black transition-all duration-200 opacity-100 cursor-pointer hover:text-emphasis-hover dark:text-gray-100 dark:hover:text-blue-300 hover:text-yellow-500",
          styles.toggleTheme
        )}
        aria-hidden="true"
        viewBox="0 0 24 24"
      >
        <mask
          className={cn(styles.moon, theme === "dark" && styles.moonDark)}
          id="moon-mask"
        >
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="white"
          />
          <circle
            cx="24"
            cy="10"
            r="6"
            fill="black"
          />
        </mask>
        <circle
          className={cn(styles.sun, theme === "dark" && styles.sunDark)}
          cx="12"
          cy="12"
          r="6"
          mask="url(#moon-mask)"
          fill="currentColor"
        />
        <g
          className={cn(styles.sunBeams, theme === "dark" && styles.sunBeamsDark)}
          stroke="currentColor"
          strokeWidth="2px"
        >
          <line
            x1="12"
            y1="1"
            x2="12"
            y2="3"
          />
          <line
            x1="12"
            y1="21"
            x2="12"
            y2="23"
          />
          <line
            x1="4.22"
            y1="4.22"
            x2="5.64"
            y2="5.64"
          />
          <line
            x1="18.36"
            y1="18.36"
            x2="19.78"
            y2="19.78"
          />
          <line
            x1="1"
            y1="12"
            x2="3"
            y2="12"
          />
          <line
            x1="21"
            y1="12"
            x2="23"
            y2="12"
          />
          <line
            x1="4.22"
            y1="19.78"
            x2="5.64"
            y2="18.36"
          />
          <line
            x1="18.36"
            y1="5.64"
            x2="19.78"
            y2="4.22"
          />
        </g>
      </svg>
    </button>
  );
};

export default ThemeToggler;
