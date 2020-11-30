import _, { isArray } from "lodash";
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

const hasHappenedBefore = (
  level: number,
  moment: number[],
  historyList: History[],
) => {
  if (historyList.length > moment.length + level) {
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
  }

  return false;
};

export const orderedSearch = async (
  initialJarList: Jar[],
  targetSize: number,
  targetJar: Jar["id"],
) => {
  try {
    let mappedAllPaths = false;
    let notFoundPathCount = 0;
    let resultSteps: Step[][] = [];
    let historyList: History[] = [];

    while (!mappedAllPaths) {
      let jarList = _.cloneDeep(initialJarList);
      let mainJar = jarList.find((jar: Jar) => jar.id === targetJar) as Jar;

      let checkAllPossibilities = 0;
      let history: History = [];

      let steps: Step[] = [];
      let level = 0;
      mappedAllPaths = notFoundPathCount > 3;

      while (
        !hasReachedGoal(mainJar, targetSize) &&
        checkAllPossibilities !== jarList.length &&
        !mappedAllPaths
      ) {
        let notFoundStep = true;
        let moment;
        for (let i = 0; i < jarList.length; i++) {
          const jar = jarList[i];
          // console.log("Main Jar", mainJar.currentSize);
          for (let j = 0; j < jarList.length; j++) {
            const secondJar = jarList[j];
            moment = canTransfer(jar, secondJar, jarList, history);
            if (
              i !== j &&
              !hasReachedGoal(mainJar, targetSize) &&
              isArray(moment) &&
              !hasHappenedBefore(level, moment, historyList)
            ) {
              setMomentOnHistory(moment, history);
              transferContent(jar, secondJar, steps);
              console.log(
                `Tranfered ${jar.name} to ${secondJar.name} -> ${jar.currentSize} | ${secondJar.currentSize}`,
              );
              notFoundStep = false;
            }
          }

          moment = canDrainJar(jar, jarList, history);
          if (
            !hasReachedGoal(mainJar, targetSize) &&
            isArray(moment) &&
            !hasHappenedBefore(level, moment, historyList)
          ) {
            setMomentOnHistory(moment, history);
            drainJar(jarList[i], steps);
            console.log(`Jar ${jar.name} was drained to ${jar.currentSize}`);
            notFoundStep = false;
          }

          moment = canFillJar(jar, jarList, history);
          if (
            !hasReachedGoal(mainJar, targetSize) &&
            isArray(moment) &&
            !hasHappenedBefore(level, moment, historyList)
          ) {
            setMomentOnHistory(moment, history);
            fillJar(jar, steps);
            console.log(`Jar ${jar.name} was filled to ${jar.currentSize}`);
            notFoundStep = false;
          }
        }
        if (hasReachedGoal(mainJar, targetSize)) {
          console.log("Reached to goal", mainJar.currentSize, targetSize);
          historyList.push(history);
          resultSteps.push(steps);
        } else if (notFoundStep) {
          console.log("Not found Solution");
          notFoundPathCount++;
          mappedAllPaths = true;
        }
        level++;
      }
    }
    console.log("result list", resultSteps);
    console.log("history list", historyList);
    let bestPath;
    for (let i = 0; i < resultSteps.length; i++) {
      for (let j = 0; j < resultSteps.length; j++) {
        if (i !== j && resultSteps[i].length >= resultSteps[j].length) {
          bestPath = resultSteps[j];
        }
      }
    }
    return bestPath;
  } catch (error) {
    console.error(error);
    return false;
  }
};
