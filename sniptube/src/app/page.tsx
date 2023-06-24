"use client";
import type { Chapter } from 'get-youtube-chapters';
import { useEffect, type FC, useState } from 'react';

interface Props {

}
interface Subtitle {
  start: string;
  dur: string;
  text: string;
}

interface Res {
  transcript: Subtitle[];
  chapters: Chapter[];
}
const Home: FC<Props> = (props) => {
  const { } = props;

  const [data, setData] = useState<Res | null>(null);

  useEffect(() => {
    try {
      fetch(
        `http://localhost:1947/youtube?videoID=${"J4pdHM-oG-s"}`, {
        // mode: "no-cors",

      }).then((res) => {
        console.log(res);
        return res.json();
      }).then((resData) => {
        console.log(resData);
        setData(resData);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div>
      {data && (
        <div>
          <h1>Transcript</h1>
          {data.transcript.map((item, index) => {
            return (
              <div key={index}>
                <p>{item.text}</p>
              </div>
            );
          })}
          <h1>Chapters</h1>
          {data.chapters.map((item, index) => {
            return (
              <div key={index}>
                <p>{item.title}</p>
              </div>
            );
          })}

        </div>
      )}
    </div >
  );
};

export default Home;
