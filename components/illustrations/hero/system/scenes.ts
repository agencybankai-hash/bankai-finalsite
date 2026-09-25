import type { ChannelScenes } from "../../types";
import { LeadgenScene } from "./LeadgenScene";

/** Сцены лидогенерации по видам. */
export const SYSTEM_SCENES: ChannelScenes<"leadgen"> = {
  leadgen: LeadgenScene,
};
