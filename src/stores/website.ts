import { devtools, persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

export type State = {};

export type Actions = {};

export const useStore = createWithEqualityFn<State & Actions>()(
  devtools((set) => ({}), { name: "website" }),
  shallow
);
