export const URL =
  process.env.NODE_ENV === "production" ? `https://www.sniptube.vercel.app/api` : "http://localhost:3000/api";

export const sortByOptions = ["Newest", "Oldest", "Timestamp", "Reverse timestamp", "A-Z", "Z-A"] as const;

export const invalidStartOrEndTimeMessage = "Invalid start or end time. Please try again.";

export const youtubeLinks = [
  "https://youtube.com/watch*",
  "https://www.youtube.com/watch*",
  "https://youtu.be/watch*",
  "https://www.youtu.be/watch*",
  "https://www.youtube-nocookie.com/watch*",
  "https://youtube-nocookie.com/watch*",
  "https://www.youtube.com/embed/watch*",
  "https://youtube.com/embed/watch*",
  "https://*.youtube.com/watch*",
  "https://www.youtube-nocookie.com/embed/*",
] as readonly string[];
