import _ from "lodash";
import { Jar, Step } from "../types";
import {
  canDrainJar,
  canFillJar,
  canTransfer,
  drainJar,
  fillJar,
  hasReachedGoal,
  transferContent
} from "./baseTools";

let resultSteps: Step[] = [];

export const deepSearch = (
  jarList: Jar[],
  targetSize: number,
  mainJar: Jar,
  history: number[][],
  steps: Step[] = []
) => {
  //Check if mainJar is filled on target size
  // console.log("main Jar", mainJar);
  if (!hasReachedGoal(mainJar, targetSize)) {
    for (let i = 0; i < jarList.length; i++) {
      // console.log("inside");
      const jar = jarList[i];
      const mainJarId = jarList.findIndex(({ id }) => mainJar.id === id);
      const historyCopy = _.cloneDeep(history);
      let result: boolean | Step[] = false;

      history = historyCopy;
      if (canFillJar(jar, jarList, history)) {
        // console.log("Can Fill");
        const copyJarList = _.cloneDeep(jarList);
        const copySteps = _.cloneDeep(steps);
        // console.log("Jar list", copyJarList, mainJarId);
        fillJar(copyJarList[i], copySteps);
        result = deepSearch(
          copyJarList,
          targetSize,
          copyJarList[mainJarId],
          history,
          copySteps
        );
        if (result) {
          return resultSteps;
        }
      }

      for (let j = 0; j < jarList.length; j++) {
        const secondJar = jarList[j];
        history = historyCopy;
        if (canTransfer(jar, secondJar, jarList, history)) {
          console.log("Can Transfer");
          const copyJarList = _.cloneDeep(jarList);
          const copySteps = _.cloneDeep(steps);
          transferContent(copyJarList[i], copyJarList[j], copySteps);
          result = deepSearch(
            copyJarList,
            targetSize,
            copyJarList[mainJarId],
            history,
            copySteps
          );
          if (result) {
            return resultSteps;
          }
        }
      }
      history = historyCopy;
      if (canDrainJar(jar, jarList, history)) {
        console.log("Can Drain");

        const copyJarList = _.cloneDeep(jarList);
        const copySteps = _.cloneDeep(steps);
        drainJar(copyJarList[i], copySteps);
        result = deepSearch(
          copyJarList,
          targetSize,
          copyJarList[mainJarId],
          history,
          copySteps
        );
        if (result) {
          return resultSteps;
        }
      }
    }
    console.log("not founded");
    return false;
  } else {
    console.log("founded");
    resultSteps = _.cloneDeep(steps);
    return true;
  }
};
