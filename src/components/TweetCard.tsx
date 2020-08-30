import React from "react";
import { TweetType } from "../hooks/useTwitter";

type TweetCardProps = {
  tweet: TweetType | null;
};

function EmptyTweet() {
  return (
    <div className="animate-pulse flex space-x-4">
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-gray-400 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-400 rounded"></div>
          <div className="h-4 bg-gray-400 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}

export default function TweetCard({ tweet }: TweetCardProps) {
  return (
    <div
      className="box-content shadow-lg border px-4 py-2 max-w-sm mx-auto border-gray-900 border-b-4 border-r-4 rounded-md"
      style={{ height: "80vh", width: "75vw" }}
    >
      {tweet && <p>{tweet.tweet}</p>}
      {!tweet && <EmptyTweet />}
    </div>
  );
}
