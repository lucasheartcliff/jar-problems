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

const initializingSteps = (jarList: Jar[]) => {
  return jarList.map(() => []);
};

export const breadthFirstSearch = async (
  jarList: Jar[],
  targetSize: number,
  mainJar: Jar,
) => {
  let steps: Step[][] = initializingSteps(jarList);
  let checkAllPossibilities = false;

  while (!hasReachedGoal(mainJar, targetSize) && !checkAllPossibilities) {
    let notFoundStep = true;
    for (let i = 0; i < jarList.length; i++) {
      const jar = jarList[i];
      for (let j = 0; j < jarList.length; j++) {
        const secondJar = jarList[j];
        if (
          i !== j &&
          !hasReachedGoal(mainJar, targetSize) &&
          canTransfer(jar, secondJar, jarList, history)
        ) {
          transferContent(jar, secondJar, steps[i]);
          notFoundStep = false;
        }
      }

      if (
        !hasReachedGoal(mainJar, targetSize) &&
        canDrainJar(jar, jarList, history)
      ) {
        drainJar(jarList[i], steps[i]);
        notFoundStep = false;
      }

      if (
        !hasReachedGoal(mainJar, targetSize) &&
        canFillJar(jar, jarList, history)
      ) {
        fillJar(jar, steps[i]);
        notFoundStep = false;
      }

      if (hasReachedGoal(mainJar, targetSize)) {
        resultSteps = steps[i];
      } else if (notFoundStep) {
        checkAllPossibilities = true;
      }
    }
  }

  if (hasReachedGoal(mainJar, targetSize)) {
    return resultSteps;
  } else {
    return false;
  }
};
