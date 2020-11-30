import { isArray } from "lodash";
import { Jar, Step, History } from "../types";
import {
  canDrainJar,
  canFillJar,
  canTransfer,
  drainJar,
  fillJar,
  hasReachedGoal,
  setMomentOnHistory,
  transferContent,
} from "./baseTools";

const initializingSteps = (jarList: Jar[]) => {
  return jarList.map(() => []);
};

export const backTrackingSearch = async (
  jarList: Jar[],
  targetSize: number,
  mainJar: Jar,
) => {
  let steps: Step[][] = initializingSteps(jarList);
  let checkAllPossibilities = 0;

  let resultSteps: Step[] = [];
  let history: History = [];

  try {
    while (
      !hasReachedGoal(mainJar, targetSize) &&
      checkAllPossibilities !== jarList.length
    ) {
      let notFoundStep = true;
      let moment;
      let countNotFinded = 0;

      for (let i = 0; i < jarList.length; i++) {
        const jar = jarList[i];
        console.log("Main Jar", mainJar.currentSize);
        for (let j = 0; j < jarList.length; j++) {
          const secondJar = jarList[j];

          moment = canTransfer(jar, secondJar, jarList, history);
          if (
            i !== j &&
            !hasReachedGoal(mainJar, targetSize) &&
            isArray(moment)
          ) {
            setMomentOnHistory(moment, history);
            transferContent(jar, secondJar, steps[i]);
            console.log(
              `Tranfered ${jar.name} to ${secondJar.name} -> ${jar.currentSize} | ${secondJar.currentSize}`,
            );
            notFoundStep = false;
          }
        }

        moment = canDrainJar(jar, jarList, history);
        if (!hasReachedGoal(mainJar, targetSize) && isArray(moment)) {
          setMomentOnHistory(moment, history);
          drainJar(jarList[i], steps[i]);
          console.log(`Jar ${jar.name} was drained to ${jar.currentSize}`);
          notFoundStep = false;
        }

        moment = canFillJar(jar, jarList, history);
        if (!hasReachedGoal(mainJar, targetSize) && isArray(moment)) {
          setMomentOnHistory(moment, history);
          fillJar(jar, steps[i]);
          console.log(`Jar ${jar.name} was filled to ${jar.currentSize}`);
          notFoundStep = false;
        }

        if (hasReachedGoal(mainJar, targetSize) && !resultSteps.length) {
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
