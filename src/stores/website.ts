import { createRef, type RefObject } from "react";
import { devtools, persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

export type State = {
  heroTextRef: RefObject<HTMLDivElement>;
};

export type Actions = {};

export const useStore = createWithEqualityFn<State & Actions>()(
  devtools(
    (set) => ({
      heroTextRef: createRef<HTMLDivElement>(),
    }),
    { name: "website", enabled: process.env.NODE_ENV === "development" }
  ),
  shallow
);
