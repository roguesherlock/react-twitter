import React from "react";

import TweetCard from "./TweetCard";
import Controls from "./Controls";

import useTwitter from "../hooks/useTwitter";

export default function Twitter(props: any) {
  const { onNext, onPrev, onComment, onLike, tweet, bindInput } = useTwitter();

  return (
    <div className="box-content flex items-center justify-center h-screen mx-auto">
      <div className="flex flex-col items-center justify-around h-full">
        <TweetCard tweet={tweet} />
        <input
          className="border border-solid px-4 py-2 border-gray-900 focus:outline-none focus:border-r-4 focus:border-b-4 bg-transparent rounded-md placeholder-gray-500 placeholder-opacity-100"
          placeholder="Stream tweets for "
          {...bindInput}
        />
        <Controls tweet={tweet} hooks={{ onComment, onLike, onNext, onPrev }} />
      </div>
    </div>
  );
}
