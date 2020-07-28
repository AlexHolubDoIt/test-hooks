import { useState, useRef, useCallback } from "react";
import deepEqual from "deep-equal";

export type ToggleStateFunc<T> = (value?: T) => void;
export type UseToggleStateValue<T> = [T, ToggleStateFunc<T>];
export interface IToggleStateArgument<T> {
  possibleStates: T[];
  initialState?: T;
}

export const useToggleState = <T>({
  possibleStates,
  initialState,
}: IToggleStateArgument<T>): UseToggleStateValue<T> => {
  if (!possibleStates || !Array.isArray(possibleStates) || possibleStates.length < 1) {
    throw new Error("List of possible states must contain at least one item");
  }

  const initialStateIndex = possibleStates.findIndex((value) => deepEqual(value, initialState));

  if (initialStateIndex === -1 && process.env.NODE_ENV === "development") {
    console.warn(
      "Provided initialState is not on the list of possible state values. Using first possible value instead"
    );
  }

  const initialIndex = initialStateIndex === -1 ? 0 : initialStateIndex;
  const [state, setState] = useState<T>(possibleStates[initialIndex]);
  const prevIndex = useRef(initialIndex);

  const toggleStateFunction = useCallback(
    (newState?: T): void => {
      if (newState == null) {
        const newIndex = prevIndex.current + 1 >= possibleStates.length ? 0 : prevIndex.current + 1;

        prevIndex.current++;
        setState(possibleStates[newIndex]);
      } else {
        const newIndex = possibleStates.findIndex((value) => deepEqual(value, newState));

        if (newIndex === -1) {
          if (process.env.NODE_ENV === "development") {
            console.warn("Provided newState value is not on the list of possible values");
          }
          return;
        }

        prevIndex.current = newIndex;
        setState(newState);
      }
    },
    [possibleStates]
  );

  return [state, toggleStateFunction];
};
