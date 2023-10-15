import { type FC } from "react";

interface Props {}

const NoSnips: FC<Props> = (props) => {
  const {} = props;

  return (
    <main className="flex flex-col items-center justify-center my-auto">
      <h1 className="text-2xl font-semibold">No Snips Found</h1>
      <p className="text-lg text-center">
        Add a snip to this video by clicking the logo at the bottom corner of the YouTube video player.
      </p>
    </main>
  );
};

export default NoSnips;
