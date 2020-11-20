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

const search = (
  jarMatrix: Jar[][],
  targetSize: number,
  mainJarIndex: number,
  history = [],
  stepsMatrix: Step[][] = [],
) => {
  let newJarMatrix = []
  
  for (let jarListIndex in jarMatrix) {
    let length = jarMatrix[jarListIndex].length;

    for (let i = 0; i < length; i++) {
      let moment;
      let jarListCopy = _.cloneDeep(jarMatrix[jarListIndex]);
      let currentJar = jarListCopy[i];
      let mainJar = jarListCopy[mainJarIndex]; //get reference of main jar
      let steps = _.cloneDeep(stepsMatrix[jarListIndex] || []);

      if (!hasReachedGoal(mainJar, targetSize)) {
        moment = canFillJar(currentJar, jarListCopy, history);

        if (moment) {
          setMomentOnHistory(moment, history);
          fillJar(currentJar, steps);
        } else {
          moment = canDrainJar(currentJar, jarListCopy, history);

          if (moment) {
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

              if (i !== j && moment) {
                setMomentOnHistory(moment, history);
                transferContent(currentJar, anotherJar, steps);
              }
            }
          }
        }
        newJarMatrix.push(jarListCopy)

      }else{
        return steps
      }
    }
  }

  search(newJarMatrix,targetSize,mainJarIndex,history,)
};

export const breadthFirst = async (
  jarList: Jar[],
  targetSize: number,
  mainJar: Jar,
) => {
  try {
    let mainJarIndex = jarList.findIndex((jar) => jar.id === mainJar.id);
    search([jarList], targetSize, mainJarIndex);
    return;
  } catch (error) {
    console.error(error);
  }
};
