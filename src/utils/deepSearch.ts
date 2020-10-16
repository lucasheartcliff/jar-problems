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

export const deepSearch = (
  jarList: Jar[],
  targetSize: number,
  mainJar: Jar,
  history: number[][] = [],
  steps: Step[] = []
) => {
  //Check if mainJar is filled on target size
  if (!hasReachedGoal(mainJar, targetSize)) {
    for (let i = 0; i < jarList.length; i++) {
      const jar = jarList[i];

      if (canFillJar(jar, jarList, history)) {
        const copyJarList = _.cloneDeep(jarList);
        const copySteps = _.cloneDeep(steps);
        fillJar(copyJarList[i], copySteps);
        deepSearch(copyJarList, targetSize, mainJar, history, copySteps);
      }

      for (let j = 0; j < jarList.length; j++) {
        const secondJar = jarList[j];
        if (canTransfer(jar, secondJar, jarList, history)) {
          const copyJarList = _.cloneDeep(jarList);
          const copySteps = _.cloneDeep(steps);
          transferContent(copyJarList[i], copyJarList[j], copySteps);
          deepSearch(copyJarList, targetSize, mainJar, history, copySteps);
        }
      }

      if (canDrainJar(jar, jarList, history)) {
        const copyJarList = _.cloneDeep(jarList);
        const copySteps = _.cloneDeep(steps);
        drainJar(copyJarList[i], copySteps);
        deepSearch(copyJarList, targetSize, mainJar, history, copySteps);
      }
      //Can Transfer
      //Can Drain
    }

    //return result of function return
    return false;
  } else {
    return true;
  }
};
