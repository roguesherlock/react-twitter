import { useReducer, useCallback, useEffect } from "react";

import io from "socket.io-client";

export type TweetType = {
  tweet: string;
  id: string;
  liked: boolean;
  comments: TweetType[];
};

type twitterReducerStateType = {
  tweets: TweetType[];
  currentTweet: TweetType | null;
};

type twitterReducerActionTypes = {
  type: string;
  value?: string | TweetType | Record<string, unknown>[];
};

const twitterReducer = (
  state: twitterReducerStateType,
  action: twitterReducerActionTypes
) => {
  switch (action.type) {
    case "add": {
      const tweets = state.tweets;
      return { ...state, tweets: [...tweets, action.value! as TweetType] };
    }
    default: {
      return state;
    }
  }
};

const initialTweetReducerState = {
  tweets: [],
  currentTweet: null,
};

const getSocketUrl = () => {
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3001/";
  } else {
    return "/";
  }
};

export default function useTwitter() {
  const [state, dispatch] = useReducer(
    twitterReducer,
    initialTweetReducerState
  );

  const streamTweets = useCallback(() => {
    const socket = io(getSocketUrl());

    socket.on("connect", () => {});
    socket.on("tweet", (response: Record<string, unknown>) => {
      if (response.data) {
        dispatch({ type: "add", value: response.data as TweetType });
      }
    });
    socket.on("heartbeat", (data: any) => {
      console.log("update waiting...");
    });
    socket.on("error", (data: Record<string, unknown>) => {
      dispatch({ type: "errors", value: [data] });
    });
    socket.on("authError", (data: Record<string, unknown>) => {
      dispatch({ type: "errors", value: [data] });
    });
  }, []);

  useEffect(() => {
    streamTweets();
  }, [streamTweets]);

  return {
    tweets: state.tweets,
  } as const;
}
