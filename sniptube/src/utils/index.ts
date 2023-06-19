export const getChapters = async (vidId: string) => {
  const html = await fetch(`https://www.youtube.com/watch?v=${vidId}`).then(res => res.text()).then(html => {
    // extract the body of the html
    const temp = html.split('<body')[1].split('</body>')[0];
    // remove all the script tags
    const regex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    temp.replace(regex, '');

    return temp;
  });

  console.log("html", html);
  const parser = new DOMParser();
  const doc = parser.parseFromString(document.body.innerHTML, 'text/html');

  // Find all the chapter links
  const chapterLinks = doc.querySelectorAll('span.yt-core-attributed-string--link-inherit-color > a.yt-core-attributed-string__link.yt-core-attributed-string__link--display-type.yt-core-attributed-string__link--call-to-action-color');
  console.log("chapterLinks", chapterLinks);
  // remove
  const chapters: { timestamp: string; title: string }[] = [];

  // Extract timestamp and title from each chapter link
  chapterLinks.forEach(link => {
    const timestamp = link.textContent;
    const title = link.parentElement?.nextSibling?.textContent?.trim();
    if (timestamp && title) {
      chapters.push({ timestamp, title });
    }
  });

  // Print the extracted chapters
  chapters.forEach((chapter, index) => {
    console.log(`Chapter ${index + 1}: ${chapter.timestamp} - ${chapter.title}`);
  });
};
