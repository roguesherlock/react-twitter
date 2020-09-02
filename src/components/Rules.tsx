import React from "react";

import useRules, { ErrorType, RuleType } from "../hooks/useRules";

function ErrorMessage({ error }: { error: ErrorType }) {
  return <div></div>;
}

function Rule({
  rule,
  onDelete,
}: {
  rule: RuleType;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={
        "flex items-center jusitfy-between bg-gray-500 rounded-full py-2 px-4 m-2"
      }
    >
      <div>{rule.value}</div>
      <div className="pl-2 cursor-pointer" onClick={() => onDelete(rule.id)}>
        <svg
          className="h-6 w-6 hover:bg-gray-300 hover:rounded-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
  );
}

export default function Rules(props: any) {
  const { rules, errors, onDelete, bindInput } = useRules();

  return (
    <div className="flex flex-col items-center justify-between">
      <div>
        {errors &&
          errors.map((error) => <ErrorMessage key={error.id} error={error} />)}
      </div>
      <div
        className={
          "flex box-content align-center justify-center flex-wrap border border-gray-900 rounded-md px-4 py-2"
        }
      >
        {rules.length > 0 ? (
          rules.map((rule) => (
            <Rule key={rule.id} rule={rule} onDelete={onDelete} />
          ))
        ) : (
          <div className="italic text-sm text-gray-500">
            rules will show up here
          </div>
        )}
      </div>
      <div className={"mt-2"}>
        <input
          className="border border-solid px-4 py-2 border-gray-900 focus:outline-none focus:border-r-4 focus:border-b-4 bg-transparent rounded-md placeholder-gray-500 placeholder-opacity-100"
          placeholder="Add Rules to stream tweets"
          {...bindInput}
        />
      </div>
    </div>
  );
}
