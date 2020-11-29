import _, { isArray } from "lodash";
import { Jar, Step } from "../types";
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

type Search = (
  jarMatrix: Jar[][],
  targetSize: number,
  mainJarIndex: number,
  history: any | null,
  stepsMatrix: Step[][],
  maxLevel: number,
  level?: number,
) => Step[] | undefined;

const search: Search = (
  jarMatrix: Jar[][],
  targetSize: number,
  mainJarIndex: number,
  history,
  stepsMatrix: Step[][],
  maxLevel,
  level = 0,
) => {
  if (level <= maxLevel) {
    let newJarMatrix = [];
    let newStepsMatrix = [];

    for (let jarListIndex in jarMatrix) {
      let length = jarMatrix[jarListIndex].length;

      for (let i = 0; i < length; i++) {
        let moment;
        let jarListCopy = _.cloneDeep(jarMatrix[jarListIndex]);
        let currentJar = jarListCopy[i];
        let mainJar = jarListCopy[mainJarIndex]; //get reference of main jar

        let steps =
          jarListIndex in stepsMatrix
            ? _.cloneDeep(stepsMatrix[jarListIndex])
            : [];

        if (!hasReachedGoal(mainJar, targetSize)) {
          moment = canFillJar(currentJar, jarListCopy, history);

          if (isArray(moment)) {
            setMomentOnHistory(moment, history);
            fillJar(currentJar, steps);
          } else {
            moment = canDrainJar(currentJar, jarListCopy, history);

            if (isArray(moment)) {
              setMomentOnHistory(moment, history);
              drainJar(currentJar, steps);
            } else {
              for (let j = 0; j < length; j++) {
                let anotherJar = jarListCopy[j];

                moment = canTransfer(
                  currentJar,
                  anotherJar,
                  jarListCopy,
                  history,
                );

                if (i !== j && isArray(moment)) {
                  setMomentOnHistory(moment, history);
                  transferContent(currentJar, anotherJar, steps);
                  break;
                }
              }
            }
          }

          newJarMatrix.push(jarListCopy);
          newStepsMatrix.push(steps);
        } else {
          return steps;
        }
      }
    }
    return search(
      newJarMatrix,
      targetSize,
      mainJarIndex,
      history,
      newStepsMatrix,
      maxLevel,
      level + 1,
    );
  } else {
    throw new Error("Solution not found");
  }
};

export const iteratedSearch = async (
  jarList: Jar[],
  targetSize: number,
  mainJar: Jar,
  maxLevel: number,
) => {
  try {
    let mainJarIndex = jarList.findIndex((jar) => jar.id === mainJar.id);
    return search(
      [jarList],
      targetSize,
      mainJarIndex,
      [jarList.map((jar) => jar.currentSize)],
      [],
      maxLevel,
    );
  } catch (error) {
    console.error(error);
  }
};
