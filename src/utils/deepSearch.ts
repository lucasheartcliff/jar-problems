import _ from "lodash";
import { Jar, Step } from "../types";
import { canFillJar, canTransfer, fillJar, hasReachedGoal, transferContent } from "./baseTools";

export const deepSearch = (
  jarList: Jar[],
  targetSize: number,
  mainJar: Jar,
  history: number[][] = [],
  steps: Step[] = []
) => {
  //Check if mainJar is filled on target size
  if (!hasReachedGoal(mainJar, targetSize)) {
    jarList.forEach((jar, index) => {
      //Can Fill

      if (canFillJar(jar, jarList, history)) {
        const copyJarList = _.cloneDeep(jarList);
        const copySteps = _.cloneDeep(steps);
        fillJar(copyJarList[index], copySteps);
        deepSearch(copyJarList, targetSize, mainJar, history, copySteps);
      }

      if (canTransfer(jar, jarList, history)) {
        const copyJarList = _.cloneDeep(jarList);
        const copySteps = _.cloneDeep(steps);
        transferContent(copyJarList[index], copySteps);
        deepSearch(copyJarList, targetSize, mainJar, history, copySteps);
      }
      //Can Transfer
      //Can Drain
    });

    //return result of function return
    return false;
  } else {
    return true;
  }
};
