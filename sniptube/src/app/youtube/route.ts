import { getSubtitles, getVideoDetails, type VideoDetails } from 'youtube-caption-extractor';
import { type NextRequest, NextResponse } from 'next/server'
import parseYouTubeChapters, { type Chapter } from 'get-youtube-chapters';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const videoID = searchParams.get('videoID')
  const lang = searchParams.get('lang') || 'en'

  try {
    // const subtitles = await getSubtitles({ videoID, lang }); // call this if you only need the subtitles
    const res = await getVideoDetails({ videoID, lang }) as VideoDetails; // call this if you need the subtitles and the video details
    const transcript = res.subtitles;
    const description = res.description;
    // const title = res.title;

    const chapters: Chapter[] = parseYouTubeChapters(description) || [];
    return NextResponse.json({ transcript, chapters }, {
      // allow my chrome extension to access this endpoint
      headers: {  // chrome extension will not work without this
        "Access-Control-Allow-Origin": "https://www.youtube.com",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET",
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    return NextResponse.error()
  }
}