import { create } from "zustand";
import { AWNINGS, TEAS, type AwningId, type TeaId, type TimeOfDay } from "./content";

export const DEFAULT_CUSTOMISER = {
  tea: "masala",
  awning: "marigold",
  time: "day",
} as const satisfies { tea: TeaId; awning: AwningId; time: TimeOfDay };

export interface CustomiserState {
  tea: TeaId;
  awning: AwningId;
  time: TimeOfDay;
  setTea: (id: string) => void;
  setAwning: (id: string) => void;
  setTime: (time: string) => void;
}

const isTea = (v: string): v is TeaId => TEAS.some((t) => t.id === v);
const isAwning = (v: string): v is AwningId => AWNINGS.some((a) => a.id === v);
const isTime = (v: string): v is TimeOfDay => v === "day" || v === "night";

export const useCustomiser = create<CustomiserState>()((set) => ({
  ...DEFAULT_CUSTOMISER,
  setTea: (id) => {
    if (isTea(id)) set({ tea: id });
  },
  setAwning: (id) => {
    if (isAwning(id)) set({ awning: id });
  },
  setTime: (time) => {
    if (isTime(time)) set({ time });
  },
}));
