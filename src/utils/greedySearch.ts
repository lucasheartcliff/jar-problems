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
  if (historyList.length > moment.length) {
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

const search = (
  jarList: Jar[],
  targetSize: number,
  mainJar: Jar,
  history: History,
  historyList: History[],
  score: number,
  steps: Step[] = [],
  level: number = 0,
) => {
  console.log("call", level);
  if (!hasReachedGoal(mainJar, targetSize)) {
    for (let i = 0; i < jarList.length; i++) {
      const jar = jarList[i];
      const mainJarId = jarList.findIndex(({ id }) => mainJar.id === id);
      const historyCopy = _.cloneDeep(history);

      let result: any;
      let moment;

      history = historyCopy;
      moment = canFillJar(jar, jarList, history);

      if (isArray(moment) && !hasHappenedBefore(level, moment, historyList)) {
        const copyJarList = _.cloneDeep(jarList);
        const copySteps = _.cloneDeep(steps);
        console.log("filling");
        setMomentOnHistory(moment, history);

        let newScore = score + 1;

        fillJar(copyJarList[i], copySteps);

        result = search(
          copyJarList,
          targetSize,
          copyJarList[mainJarId],
          history,
          historyList,
          newScore,
          copySteps,
          level + 1,
        );
        if (result?.steps) {
          return result;
        }
      }

      for (let j = 0; j < jarList.length; j++) {
        const secondJar = jarList[j];

        history = historyCopy;
        moment = canTransfer(jar, secondJar, jarList, history);

        if (
          i !== j &&
          isArray(moment) &&
          !hasHappenedBefore(level, moment, historyList)
        ) {
          const copyJarList = _.cloneDeep(jarList);
          const copySteps = _.cloneDeep(steps);
          console.log("transfer");

          let newScore = score;

          setMomentOnHistory(moment, history);

          transferContent(copyJarList[i], copyJarList[j], copySteps);

          result = search(
            copyJarList,
            targetSize,
            copyJarList[mainJarId],
            history,
            historyList,
            newScore,
            copySteps,
            level + 1,
          );
          if (result?.steps) {
            return result;
          }
        }
      }

      history = historyCopy;
      moment = canDrainJar(jar, jarList, history);

      if (isArray(moment) && !hasHappenedBefore(level, moment, historyList)) {
        const copyJarList = _.cloneDeep(jarList);
        const copySteps = _.cloneDeep(steps);

        let newScore = score + 2;

        setMomentOnHistory(moment, history);
        console.log("drain");

        drainJar(copyJarList[i], copySteps);

        result = search(
          copyJarList,
          targetSize,
          copyJarList[mainJarId],
          history,
          historyList,
          newScore,
          copySteps,
          level + 1,
        );
        if (result?.steps) {
          return result;
        }
      }
    }
  } else {
    return { steps, score };
  }
  debugger;
  throw "Error";
};

export const greedySearch = async(
  initialJarList: Jar[],
  targetSize: number,
  targetJar: Jar["id"],
) => {
  try {
    let mappedAllPaths = false;
    let resultSteps: Step[][] = [];
    let historyList: History[] = [];
    let scoreList: number[] = [];

    let pathsCount = 0;

    while (!mappedAllPaths && pathsCount < 5) {
      let jarList = _.cloneDeep(initialJarList);
      let mainJar = jarList.find((jar: Jar) => jar.id === targetJar) as Jar;

      let history: History = [jarList.map(({ currentSize }) => currentSize)];
      let score = 0;

      const result = search(
        jarList,
        targetSize,
        mainJar,
        history,
        historyList,
        score,
      );
      if (result?.steps) {
        resultSteps.push(result?.steps);
        scoreList.push(result.score);
        historyList.push(history);
        pathsCount++;
      } else {
        mappedAllPaths = true;
      }
    }

    const choosedPathIndex = scoreList.indexOf(Math.min(...scoreList));

    return resultSteps[choosedPathIndex];
  } catch (error) {
    console.error(error);
  }
};
