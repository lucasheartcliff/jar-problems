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

let resultSteps: Step[] = [];

export const deepSearch = async (
  jarList: Jar[],
  targetSize: number,
  mainJar: Jar,
  history: History,
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
        let moment;
        history = historyCopy;
        moment = canFillJar(jar, jarList, history);
        if (isArray(moment)) {
          setMomentOnHistory(moment, history);
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
          moment = canTransfer(jar, secondJar, jarList, history);
          if (i !== j && isArray(moment)) {
            setMomentOnHistory(moment, history);
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
        moment = canDrainJar(jar, jarList, history);
        if (isArray(moment)) {
          setMomentOnHistory(moment, history);
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
