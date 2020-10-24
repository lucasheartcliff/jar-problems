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

const initializingSteps = (jarList: Jar[]) => {
  return jarList.map(() => []);
};

export const breadthFirstSearch = async (
  jarList: Jar[],
  targetSize: number,
  mainJar: Jar,
) => {
  let steps: Step[][] = initializingSteps(jarList);
  let checkAllPossibilities = 0;

  let resultSteps: Step[] = [];
  let history: number[][] = [];
  try {
    while (
      !hasReachedGoal(mainJar, targetSize) &&
      checkAllPossibilities !== jarList.length
    ) {
      let notFoundStep = true;
      let countNotFinded = 0;
      for (let i = 0; i < jarList.length; i++) {
        const jar = jarList[i];
        console.log("Main Jar", mainJar.currentSize);
        for (let j = 0; j < jarList.length; j++) {
          const secondJar = jarList[j];
          if (
            i !== j &&
            !hasReachedGoal(mainJar, targetSize) &&
            canTransfer(jar, secondJar, jarList, history)
          ) {
            transferContent(jar, secondJar, steps[i]);
            console.log(
              `Tranfered ${jar.name} to ${secondJar.name} -> ${jar.currentSize} | ${secondJar.currentSize}`,
            );
            notFoundStep = false;
          }
        }

        if (
          !hasReachedGoal(mainJar, targetSize) &&
          canDrainJar(jar, jarList, history)
        ) {
          drainJar(jarList[i], steps[i]);
          console.log(`Jar ${jar.name} was drained to ${jar.currentSize}`);
          notFoundStep = false;
        }

        if (
          !hasReachedGoal(mainJar, targetSize) &&
          canFillJar(jar, jarList, history)
        ) {
          fillJar(jar, steps[i]);
          console.log(`Jar ${jar.name} was filled to ${jar.currentSize}`);
          notFoundStep = false;
        }

        if (hasReachedGoal(mainJar, targetSize)) {
          console.log("Reached to goal", mainJar.currentSize);
          resultSteps = steps[i];
        } else if (notFoundStep) {
          console.log("Not found Solution");
          countNotFinded += 1;
        }
      }
    }
    console.log(resultSteps, checkAllPossibilities);
    if (hasReachedGoal(mainJar, targetSize)) {
      return resultSteps;
    } else {
      return false;
    }
  } catch {
    console.log("Error!");
    return false;
  }
};
