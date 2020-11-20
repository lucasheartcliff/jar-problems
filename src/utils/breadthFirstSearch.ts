import _ from "lodash";
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

let resultSteps: Step[] = [];

const search = (
  jarMatrix: Jar[][],
  targetSize: number,
  history = [],
  steps: Step[] = [],
) => {
  for (let jarList of jarMatrix) {
    for (let i = 0; i < jarList.length; i++) {
      let moment;
      let currentJar = jarList[i];

      moment = canFillJar(currentJar, jarList, history);
      if (moment) {
        setMomentOnHistory(moment, history);
        fillJar(currentJar, steps);
      } else {
        moment = canDrainJar(currentJar, jarList, history);
        if (moment) {
          setMomentOnHistory(moment, history);
          drainJar(currentJar, steps);
        } else {
          for (let j = 0; j < jarList.length; j++) {
            let secondJar = jarList[j];
            moment = canTransfer(currentJar, secondJar, jarList, history);
            if (i !== j && moment) {
              setMomentOnHistory(moment, history);
              transferContent(currentJar, secondJar, steps);
            }
          }
        }
       
      }

    }
  }
};

export const breadthFirst = async (
  jarList: Jar[],
  targetSize: number,
  mainJar: Jar,
) => {
  try {
    let newJarList;
  } catch (error) {
    console.error(error);
  }
};
