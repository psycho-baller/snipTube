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
    const data = { transcript, chapters };
    console.log("data", data);
    const res2 = NextResponse.json(data, {
      // headers: {
      //   "Access-Control-Allow-Origin": "*",
      //   "Content-Type": "application/json",
      // },
    });
    console.log("res2", res2.json());
    return res2;
  } catch (e) {
    return NextResponse.error()
  }
}
