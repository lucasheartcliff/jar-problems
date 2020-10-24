import { Jar, Step } from "../types";
import {
  canDrainJar,
  canFillJar,
  canTransfer,
  drainJar,
  fillJar,
  hasReachedGoal,
  transferContent,
} from "./baseTools";

let resultSteps: Step[] = [];
let history: number[][] = [];

export const breadthFirstSearch = async (
  jarList: Jar[],
  targetSize: number,
  mainJar: Jar,
) => {};
