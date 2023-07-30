import type { Snip } from "./types";

// TODO: settings to specify what format to export in and what data to include
export function exportSnip(snip: Snip) {
  const { startTimestamp, endTimestamp, videoId, vidTitle, title, note, tags } = snip;
  const startTimestampMinutes = Math.floor(startTimestamp / 60);
  const startTimestampSeconds = String(Math.round(startTimestamp) % 60).padStart(2, "0");
  const endTimestampMinutes = Math.floor(endTimestamp / 60);
  const endTimestampSeconds = String(Math.round(endTimestamp) % 60).padStart(2, "0");
  const cleanedTitle = title.replace(/\n/g, " ");
  navigator.clipboard.writeText(
    `## [${vidTitle}](https://www.youtube.com/watch?v=${videoId}&t=${startTimestamp})

    ### ${cleanedTitle} | (${startTimestampMinutes}:${startTimestampSeconds} - ${endTimestampMinutes}:${endTimestampSeconds})
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
      const vidTitle = snips[0].vidTitle.replace(/\n/g, " ");
      return `## ${vidTitle} | (${snips.length} snips)

${snips
  .map((snip) => {
    const { startTimestamp, endTimestamp, title, note, tags } = snip;
    const cleanedTitle = title.replace(/\n/g, " ");
    const startTimestampMinutes = Math.floor(startTimestamp / 60);
    const startTimestampSeconds = String(Math.round(startTimestamp) % 60).padStart(2, "0");
    const endTimestampMinutes = Math.floor(endTimestamp / 60);
    const endTimestampSeconds = String(Math.round(endTimestamp) % 60).padStart(2, "0");
    return `### ${cleanedTitle} | (${startTimestampMinutes}:${startTimestampSeconds} - ${endTimestampMinutes}:${endTimestampSeconds})
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

const formatMdTitle = (title: string) => {};
