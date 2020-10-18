import _ from "lodash";
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

export const deepSearch = async (
  jarList: Jar[],
  targetSize: number,
  mainJar: Jar,
  history: number[][],
  steps: Step[] = [],
) => {
  try {
    //Check if mainJar is filled on target size
    if (!hasReachedGoal(mainJar, targetSize)) {
      for (let i = 0; i < jarList.length; i++) {
        const jar = jarList[i];
        const mainJarId = jarList.findIndex(({ id }) => mainJar.id === id);
        const historyCopy = _.cloneDeep(history);
        let result: boolean | Step[] = false;

        history = historyCopy;
        if (canFillJar(jar, jarList, history)) {
          const copyJarList = _.cloneDeep(jarList);
          const copySteps = _.cloneDeep(steps);
          fillJar(copyJarList[i], copySteps);
          result = await deepSearch(
            copyJarList,
            targetSize,
            copyJarList[mainJarId],
            history,
            copySteps,
          );
          if (result) {
            return resultSteps;
          }
        }

        for (let j = 0; j < jarList.length; j++) {
          const secondJar = jarList[j];
          history = historyCopy;
          if (i !== j && canTransfer(jar, secondJar, jarList, history)) {
            const copyJarList = _.cloneDeep(jarList);
            const copySteps = _.cloneDeep(steps);
            transferContent(copyJarList[i], copyJarList[j], copySteps);
            result = await deepSearch(
              copyJarList,
              targetSize,
              copyJarList[mainJarId],
              history,
              copySteps,
            );
            if (result) {
              return resultSteps;
            }
          }
        }
        history = historyCopy;
        if (canDrainJar(jar, jarList, history)) {
          const copyJarList = _.cloneDeep(jarList);
          const copySteps = _.cloneDeep(steps);
          drainJar(copyJarList[i], copySteps);
          result = await deepSearch(
            copyJarList,
            targetSize,
            copyJarList[mainJarId],
            history,
            copySteps,
          );
          if (result) {
            return resultSteps;
          }
        }
      }
      return false;
    } else {
      resultSteps = _.cloneDeep(steps);
      return true;
    }
  } catch {
    return false;
  }
};
