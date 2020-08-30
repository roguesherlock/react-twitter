import { useReducer, useRef, useCallback } from "react";

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
  value?: string | TweetType;
};

const twitterReducer = (
  state: twitterReducerStateType,
  action: twitterReducerActionTypes
) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

const initTwitterReducer = (_: any) => {
  return {
    tweets: [],
    currentTweet: null,
  };
};

export default function useTwitter() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, dispatch] = useReducer(
    twitterReducer,
    null,
    initTwitterReducer
  );

  const onNext = () => {
    dispatch({ type: "next" });
  };
  const onPrev = () => {
    dispatch({ type: "prev" });
  };
  const onComment = (tweet: TweetType) => {
    dispatch({ type: "comment", value: tweet });
  };
  const onLike = (tweet: TweetType) => dispatch({ type: "like", value: tweet });
  const bindInput = {
    ref: inputRef,
    onKeyPress: useCallback(
      (event: any) => {
        if (event.key === "Enter") {
          dispatch({ type: "stream", value: inputRef?.current?.value });
          inputRef!.current!.value = "";
          inputRef?.current?.focus();
        }
      },
      [dispatch]
    ),
  };
  return {
    onNext,
    onComment,
    onPrev,
    onLike,
    tweet: state.currentTweet,
    bindInput,
  } as const;
}
