import _, { isArray } from "lodash";
import { Jar, Step } from "../types";
import {
  canDrainJar,
  canFillJar,
  canTransfer,
  drainJar,
  fillJar,
  hasReachedGoal,
  initializingSteps,
  setMomentOnHistory,
  transferContent,
} from "./baseTools";

let resultSteps: Step[][] = [];
let historyList: number[][][];

const hasHappenedBefore = (level: number, moment: number[]) => {
  for (const history of historyList) {
    if (history.length - 1 >= level) {
      let equalValuesCount = 0;
      for (let i = 0; i < history[level].length; i++) {
        if (history[level][i] === moment[i]) {
          equalValuesCount += 1;
        }
      }
      if (equalValuesCount === moment.length) return true;
    }
  }
  return false;
};

export const greedySearch = async (
  initialJarList: Jar[],
  targetSize: number,
  initialMainJar: Jar,
  steps: Step[] = [],
) => {
  try {
    let mappedAllPaths = false;
    while (!mappedAllPaths) {
      let mainJar = _.cloneDeep(initialMainJar);
      let jarList = _.cloneDeep(initialJarList);

      let checkAllPossibilities = 0;
      let history: number[][] = [];

      let steps: Step[][] = initializingSteps(jarList);
      let level = 0;

      while (
        !hasReachedGoal(mainJar, targetSize) &&
        checkAllPossibilities !== jarList.length
      ) {
        let notFoundStep = true;
        let moment;
        for (let i = 0; i < jarList.length; i++) {
          const jar = jarList[i];
          console.log("Main Jar", mainJar.currentSize);
          for (let j = 0; j < jarList.length; j++) {
            const secondJar = jarList[j];
            moment = canTransfer(jar, secondJar, jarList, history);
            if (
              i !== j &&
              !hasReachedGoal(mainJar, targetSize) &&
              isArray(moment) &&
              hasHappenedBefore(level, moment)
            ) {
              setMomentOnHistory(moment, history);
              transferContent(jar, secondJar, steps[i]);
              console.log(
                `Tranfered ${jar.name} to ${secondJar.name} -> ${jar.currentSize} | ${secondJar.currentSize}`,
              );
              notFoundStep = false;
              break;
            }
          }

          moment = canDrainJar(jar, jarList, history);
          if (
            !hasReachedGoal(mainJar, targetSize) &&
            isArray(moment) &&
            hasHappenedBefore(level, moment)
          ) {
            setMomentOnHistory(moment, history);
            drainJar(jarList[i], steps[i]);
            console.log(`Jar ${jar.name} was drained to ${jar.currentSize}`);
            notFoundStep = false;
          }

          moment = canFillJar(jar, jarList, history);
          if (
            !hasReachedGoal(mainJar, targetSize) &&
            isArray(moment) &&
            hasHappenedBefore(level, moment)
          ) {
            setMomentOnHistory(moment, history);
            fillJar(jar, steps[i]);
            console.log(`Jar ${jar.name} was filled to ${jar.currentSize}`);
            notFoundStep = false;
          }

          if (hasReachedGoal(mainJar, targetSize) && !resultSteps.length) {
            console.log("Reached to goal", mainJar.currentSize);
            historyList.push(history);
            resultSteps.push(steps[i]);
          } else if (notFoundStep) {
            console.log("Not found Solution");
            mappedAllPaths = true;
          }
        }
        level++;
      }
    }
  } catch {
    return false;
  }
};
