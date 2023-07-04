import type { Snip } from "./types";


// TODO: settings to specify what format to export in and what data to include
export function exportSnip(snip: Snip) {
  const { startTimestamp, endTimestamp, videoId, vidTitle, title, note } = snip;
  navigator.clipboard.writeText(
    // Markdown format
    `## [${vidTitle}](https://www.youtube.com/watch?v=${videoId}&t=${startTimestamp})

    #### ${title} | (${Math.floor(startTimestamp / 60)}:${String(Math.round(startTimestamp) % 60).padStart(2, "0")} - ${Math.floor(endTimestamp / 60)}:${String(Math.round(endTimestamp) % 60).padStart(2, "0")})
    
    ${note}

    ${snip.tags?.map((tag) => `${tag.name}`).join(', ') ?? ''}`);
}

// TODO: structure the data better
export function exportSnips(snips: Snip[]) {
  const text = snips.map((snip) => {
    const { startTimestamp, endTimestamp, videoId, vidTitle, title, note } = snip;
    return `## [${vidTitle}](https://www.youtube.com/watch?v=${videoId}&t=${startTimestamp})

    #### ${title} | (${Math.floor(startTimestamp / 60)}:${String(Math.round(startTimestamp) % 60).padStart(2, "0")} - ${Math.floor(endTimestamp / 60)}:${String(Math.round(endTimestamp) % 60).padStart(2, "0")})
    
    ${note}

    ${snip.tags?.map((tag) => `${tag.name}`).join(', ') ?? ''}`;
  }).join('\n\n');

  navigator.clipboard.writeText(text);
}
