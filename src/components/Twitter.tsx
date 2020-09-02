import React, { useState, useCallback } from "react";

import TweetCard from "./TweetCard";
import Controls from "./Controls";
import Rules from "./Rules";

import useTwitter from "../hooks/useTwitter";

export default function Twitter(props: any) {
  const { tweets } = useTwitter();
  const endIndex = tweets.length - 1;
  const [currentTweetIndex, setCurrentTweetIndex] = useState(endIndex);

  const onNext = useCallback(() => {
    setCurrentTweetIndex((index) => {
      const i = index - 1;
      if (i < 0) return index;
      else return i;
    });
  }, [setCurrentTweetIndex]);

  const onPrev = useCallback(() => {
    setCurrentTweetIndex((index) => {
      let i = index + 1;
      if (i > endIndex) return index;
      else return i;
    });
  }, [setCurrentTweetIndex, endIndex]);

  return (
    <div className="box-content flex items-center justify-center h-screen mx-auto">
      <div className="flex flex-col items-center justify-around h-full">
        <TweetCard tweet={tweets[currentTweetIndex]} />
        <Rules />
        <Controls hooks={{ onNext, onPrev }} />
      </div>
    </div>
  );
}
