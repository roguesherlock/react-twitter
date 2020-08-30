import React from "react";
import { TweetType } from "../hooks/useTwitter";

type ControlsHook = {
  onNext?: () => void;
  onPrev?: () => void;
  onLike?: (tweet: TweetType) => void;
  onComment?: (tweet: TweetType) => void;
};

type ControlsPropType = {
  tweet: TweetType | null;
  hooks?: ControlsHook;
};

export default function Controls({ tweet, hooks }: ControlsPropType) {
  return (
    <div
      className="box-content flex items-center py-2 px-4 justify-around max-w-sm mx-auto border border-gray-900 shadow-md rounded-md"
      style={{ width: "60vw" }}
    >
      <div
        onClick={() => hooks?.onPrev?.()}
        className="cursor-pointer transition duration-500 ease-in-out transform hover:text-yellow-600 hover:scale-150"
      >
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </div>
      <div
        onClick={() => tweet && hooks?.onComment?.(tweet)}
        className="cursor-pointer transition duration-500 ease-in-out transform hover:text-blue-600 hover:scale-150"
      >
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <div
        onClick={() => tweet && hooks?.onLike?.(tweet)}
        className="cursor-pointer transition duration-500 ease-in-out transform hover:text-red-600 hover:scale-150"
      >
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill={tweet?.liked ? "#ff0000" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>
      <div
        onClick={() => hooks?.onNext?.()}
        className="cursor-pointer transition duration-500 ease-in-out transform hover:text-yellow-600 hover:scale-150"
      >
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
}
