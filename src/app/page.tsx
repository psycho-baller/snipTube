"use client";
import { useEffect, type FC, useState } from "react";
import type { VidDetails } from "src/utils/types";
import { URL } from "src/utils/constants";
import { getFullSummary } from "src/utils/youtube";
interface Props {}

const Home: FC<Props> = (props) => {
  const {} = props;

  const [data, setData] = useState<VidDetails | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetch(`${URL}/youtube?videoID=${"7Fer7W3JCPU"}`, {
          method: "GET",
        })
          .then((res) => {
            console.log(res);
            return res.json();
          })
          .then((resData) => {
            setData(resData);
            console.log(resData);
            return resData as VidDetails;
          });
        const vidTranscript = data.transcript.map((d) => d.text).join(" ");
        const summary = await getFullSummary(vidTranscript, data.title, "7Fer7W3JCPU");
        console.log(summary);
        setSummary(summary);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      {data && (
        <div>
          <h2>Summary</h2>
          <p>{summary}</p>
          <h2>Transcript</h2>
          {data.transcript.map((item, index) => {
            return (
              <div key={index}>
                <p>{item.text}</p>
              </div>
            );
          })}
          <h2>Chapters</h2>
          {data.chapters.map((item, index) => {
            return (
              <div key={index}>
                <p>{item.title}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
