"use client";
import { useEffect, type FC, useState } from 'react';
import type { VidDetails } from '~utils/types';
import { URL } from '~utils/constants';
interface Props {

}

const Home: FC<Props> = (props) => {
  const { } = props;

  const [data, setData] = useState<VidDetails | null>(null);

  useEffect(() => {
    try {
      fetch(`${URL}/youtube?videoID=${"7Fer7W3JCPU"}`, {
        method: "GET",
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
