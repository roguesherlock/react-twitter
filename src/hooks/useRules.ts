import { useRef, useCallback, useReducer, useEffect } from "react";

import axios from "axios";

const rulesURL = "/api/rules";

export type ErrorType = Record<string, string>;
export type RuleType = { value: string; id: string; tag?: string };

type RulesReducerStateType = {
  rules: RuleType[];
  errors: ErrorType[];
};

type RulesReducerActionTypes = {
  type: string;
  value?: string | RuleType[] | ErrorType[];
};

const rulesReducer = (
  state: RulesReducerStateType,
  action: RulesReducerActionTypes
) => {
  switch (action.type) {
    case "rules": {
      return { ...state, rules: action.value! as RuleType[] };
    }
    case "add": {
      const rules = [...state.rules, ...(action.value! as RuleType[])];
      return { ...state, rules };
    }
    case "delete": {
      const rules = state.rules.filter((rule) => rule.id !== action.value!);
      return { ...state, rules };
    }
    case "errors": {
      const errors = [...state.errors, ...(action.value! as ErrorType[])];
      return { ...state, errors };
    }
    default:
      return state;
  }
};

const initialRules = { rules: [], errors: [] };

export default function useRules() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, dispatch] = useReducer(rulesReducer, initialRules);

  const createRule = useCallback(async (rule: string) => {
    const payload = { add: [{ value: rule }] };

    try {
      const response = await axios.post(rulesURL, payload);
      console.log(response);
      if (response.data.errors)
        dispatch({
          type: "errors",
          value: response.data.errors as ErrorType[],
        });
      else {
        console.log(response);
        dispatch({ type: "add", value: response.data.data as RuleType[] });
      }
    } catch (e) {
      dispatch({
        type: "errors",
        value: [{ detail: e.message }],
      });
    }
  }, []);

  const onDelete = useCallback(async (id: string) => {
    const payload = { delete: { ids: [id] } };
    await axios.post(rulesURL, payload);
    dispatch({ type: "delete", value: id });
  }, []);

  const bindInput = {
    ref: inputRef,
    onKeyPress: useCallback(
      (event: any) => {
        if (event.key === "Enter") {
          const input = inputRef!.current!;
          createRule(input.value);
          input.value = "";
          input.focus();
        }
      },
      [createRule]
    ),
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(rulesURL);

        console.log(response);
        const { data: rules = [] } = response.data;
        dispatch({
          type: "rules",
          value: rules as RuleType[],
        });
      } catch (e) {
        dispatch({ type: "errors", value: [e.response.data] as ErrorType[] });
      }
    })();
  }, []);
  return {
    rules: state.rules,
    bindInput,
    errors: state.errors,
    onDelete,
  } as const;
}
