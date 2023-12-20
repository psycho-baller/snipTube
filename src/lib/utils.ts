import { cva } from "class-variance-authority";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Snip, SortByOptionsType } from "./types";

export function filterAndSortSnips(snips: Snip[], sortBy: SortByOptionsType, selectedTags: string[]): Snip[] {
  return snips
    .filter((snip) => {
      if (selectedTags.length === 0) {
        return true;
      }
      // if any of the selected tags are in the snip's tags, return true
      return snip?.tags?.some((tag) => selectedTags.includes(tag.name)) ?? false;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Newest":
          return b.createdAt - a.createdAt;
        case "Oldest":
          return a.createdAt - b.createdAt;
        case "Timestamp":
          return a.endTimestamp - b.endTimestamp;
        case "Reverse timestamp":
          return b.endTimestamp - a.endTimestamp;
        case "A-Z": // chronological
          return a.title?.localeCompare(b.title);
        case "Z-A": // reverse chronological
          return b.title?.localeCompare(a.title);
        default:
          return b.createdAt - a.createdAt;
      }
    });
}

// TODO: settings to specify what format to export in and what data to include
export function exportSnip(snip: Snip) {
  const { startTimestamp, endTimestamp, videoId, vidTitle, title, note, tags } = snip;
  const startTimestampMinutes = Math.floor(startTimestamp / 60);
  const startTimestampSeconds = String(Math.round(startTimestamp) % 60).padStart(2, "0");
  const endTimestampMinutes = Math.floor(endTimestamp / 60);
  const endTimestampSeconds = String(Math.round(endTimestamp) % 60).padStart(2, "0");
  const cleanedTitle = title?.replace(/\n/g, " ") ?? "";
  navigator.clipboard.writeText(
    `## [${vidTitle}](https://www.youtube.com/watch?v=${videoId}&t=${startTimestamp})
### ${
      cleanedTitle ? cleanedTitle + " | " : ""
    }(${startTimestampMinutes}:${startTimestampSeconds} - ${endTimestampMinutes}:${endTimestampSeconds})
${note}
${tags?.map((tag) => `${tag.name}`).join(", ") ?? ""}`
  );
}

// TODO: structure the data better
export function exportSnips(snips: Snip[]) {
  // group by videoId
  const groupedSnips = snips.reduce((acc, snip) => {
    if (!acc[snip.videoId]) {
      acc[snip.videoId] = [];
    }
    acc[snip.videoId].push(snip);
    return acc;
  }, {} as Record<string, Snip[]>);

  const text = Object.entries(groupedSnips)
    .map(([videoId, snips]) => {
      const vidTitle = snips[0].vidTitle?.replace(/\n/g, " ") ?? "";
      return `## ${vidTitle} | (${snips.length} ${snips.length === 1 ? "snip" : "snips"})
${snips
  .map((snip) => {
    const { startTimestamp, endTimestamp, title, note, tags } = snip;
    const cleanedTitle = title?.replace(/\n/g, " ") ?? "";
    const startTimestampMinutes = Math.floor(startTimestamp / 60);
    const startTimestampSeconds = String(Math.round(startTimestamp) % 60).padStart(2, "0");
    const endTimestampMinutes = Math.floor(endTimestamp / 60);
    const endTimestampSeconds = String(Math.round(endTimestamp) % 60).padStart(2, "0");
    return `### ${
      cleanedTitle ? cleanedTitle + " | " : ""
    }(${startTimestampMinutes}:${startTimestampSeconds} - ${endTimestampMinutes}:${endTimestampSeconds})
${note}
${tags?.length > 0 ? tags.map((tag) => `${tag.name}`).join(", ") + "\n\n" : ""}`;
  })
  .join("")}`;
    })
    .join("---\n\n");

  navigator.clipboard.writeText(text);
}

// export function absoluteUrl(path: string) {
//   return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
// }

// const formatMdTitle = (title: string) => {};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

