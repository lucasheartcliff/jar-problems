import { Jar, Step } from "../types";
let steps: Step[] = [];

const transferAContentToB = (jarA: Jar, jarB: Jar) => {
  const toTransferSize = jarB.maxSize - jarB.currentSize;
  console.log("jar a size", jarB.currentSize);

  jarB.currentSize +=
    jarB.currentSize + jarA.currentSize > jarB.maxSize
      ? toTransferSize
      : jarA.currentSize;

  jarA.currentSize -=
    toTransferSize > jarA.currentSize ? jarA.currentSize : toTransferSize;

  console.log("transfer jar", jarA);
  console.log("to jar", jarB);
  steps.push({
    type: "transfer",
    origin: {
      name: jarA.name,
      currentSize: jarA.currentSize
    },
    destiny: {
      name: jarB.name,
      currentSize: jarB.currentSize
    }
  });
};

const drainJar = (jar: Jar) => {
  jar.currentSize = 0;

  console.log("draining jar", jar);
  steps.push({
    type: "drain",
    destiny: {
      name: jar.name,
      currentSize: jar.currentSize
    }
  });
};

const fillJar = (jar: Jar) => {
  jar.currentSize = jar.maxSize;
  console.log("filling jar", jar);
  steps.push({
    type: "fill",
    destiny: {
      name: jar.name,
      currentSize: jar.currentSize
    }
  });
};
const isInLoop = (prevousSize: number[], currentSize: number[]) => {
  const size = prevousSize.length;
  if (size) {
    console.log(prevousSize, currentSize);
    for (let i = 0; i < prevousSize.length; i++) {
      if (prevousSize[i] !== currentSize[i]) {
        return false;
      }
    }
    return true;
  }
};

const firstSolution = (mainJar: Jar, currentJar: Jar, targetSize: number) => {
  console.log("First Solution");
  while (mainJar.currentSize !== targetSize) {
    console.log(currentJar, mainJar);
    fillJar(currentJar);
    transferAContentToB(currentJar, mainJar);
  }
  return true;
};

const secondSolution = (
  mainJar: Jar,
  jarA: Jar,
  jarB: Jar,
  targetSize: number
) => {
  console.log("Second Solution");
  let prevousSize: number[] = [];
  let currentSize: number[] = [];

  while (
    mainJar.currentSize !== targetSize &&
    !isInLoop(prevousSize, currentSize)
  ) {
    prevousSize = [jarA.currentSize, jarB.currentSize, mainJar.currentSize];

    if (targetSize % jarA.currentSize === 0) {
      drainJar(jarB);
      transferAContentToB(jarA, mainJar);
    }
    if (mainJar.currentSize === targetSize) {
      return true;
    }
    fillJar(jarA);
    transferAContentToB(jarA, jarB);

    currentSize = [jarA.currentSize, jarB.currentSize, mainJar.currentSize];
  }
  return mainJar.currentSize === targetSize;
};

const thirdSolution = (
  mainJar: Jar,
  jarA: Jar,
  jarB: Jar,
  jarC: Jar,
  targetSize: number
) => {
  console.log("Third Solution");
  let prevousSize: number[] = [];
  let currentSize: number[] = [];
  while (
    mainJar.currentSize !== targetSize &&
    !isInLoop(prevousSize, currentSize)
  ) {
    prevousSize = [
      jarA.currentSize,
      jarB.currentSize,
      jarC.currentSize,
      mainJar.currentSize
    ];

    if (targetSize % jarA.currentSize === 0) {
      drainJar(jarB);
      transferAContentToB(jarA, jarC);
    }
    fillJar(jarA);
    transferAContentToB(jarA, jarB);
    if (jarC.currentSize === targetSize) {
      drainJar(mainJar);
      transferAContentToB(jarC, mainJar);
    }

    currentSize = [
      jarA.currentSize,
      jarB.currentSize,
      jarC.currentSize,
      mainJar.currentSize
    ];
  }
  return mainJar.currentSize === targetSize;
};

const fourthSolution = (
  mainJar: Jar,
  jarA: Jar,
  jarB: Jar,
  targetSize: number
) => {
  console.log("Second Solution");
  let prevousSize: number[] = [];
  let currentSize: number[] = [];

  while (
    mainJar.currentSize !== targetSize &&
    !isInLoop(prevousSize, currentSize)
  ) {
    prevousSize = [jarA.currentSize, jarB.currentSize, mainJar.currentSize];

    fillJar(jarA);
    fillJar(jarB);
    transferAContentToB(jarA, mainJar);
    transferAContentToB(jarB, mainJar);

    currentSize = [jarA.currentSize, jarB.currentSize, mainJar.currentSize];
  }
  return mainJar.currentSize === targetSize;
};

export const fillJarToTargetSize = (
  jarList: Jar[],
  targetSize: number,
  mainJar: Jar
) => {
  if (!(mainJar.maxSize < targetSize)) {
    for (let i = 0; i < jarList.length; i++) {
      for (let j = 0; j < jarList.length; j++) {
        if (targetSize % jarList[j].maxSize === 0) {
          if (firstSolution(mainJar, jarList[j], targetSize)) {
            return steps;
          }
        } else if (
          targetSize % Math.abs(jarList[i].maxSize - jarList[j].maxSize) ===
          0
        ) {
          let jarA;
          let jarB;
          if (jarList[i].maxSize > jarList[j].maxSize) {
            jarA = jarList[j];
            jarB = jarList[i];
          } else {
            jarA = jarList[i];
            jarB = jarList[j];
          }
          console.log(jarA, jarB, mainJar);
          if (secondSolution(mainJar, jarA, jarB, targetSize)) {
            return steps;
          } else {
            steps = [];
            let jarC;
            for (let k = 0; k < jarList.length; k++) {
              if (k !== i && k !== j && jarList[k].maxSize >= targetSize) {
                jarC = jarList[k];
                if (thirdSolution(mainJar, jarA, jarB, jarC, targetSize)) {
                  return steps;
                }
              }
            }
          }
        } else if (
          targetSize % Math.abs(jarList[i].maxSize + jarList[j].maxSize) ===
          0
        ) {
          let jarA;
          let jarB;
          if (jarList[i].maxSize > jarList[j].maxSize) {
            jarA = jarList[j];
            jarB = jarList[i];
          } else {
            jarA = jarList[i];
            jarB = jarList[j];
          }
          console.log(jarA, jarB, mainJar);
          if (fourthSolution(mainJar, jarA, jarB, targetSize)) {
            return steps;
          }
        }
      }
    }
    return false;
  }
};

export const deepSearch = (
  jarList: Jar[],
  targetSize: number,
  mainJar: Jar,
  history: any = []
) => {
  //Check if mainJar is filled on target size
  if (/**Not completed */ true) {
    for (let i in jarList) {
      //Can Fill
      //Can Transfer
      //Can Drain
    }
    //return result of function return
    return false;
  } else {
    return true;
  }
};
