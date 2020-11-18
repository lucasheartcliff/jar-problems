import { Jar, Step, History } from "../types";

export const hasHappened = (newMoment: number[], history: History) => {
  for (const moment of history) {
    let equalValuesCount = 0;
    for (let i = 0; i < newMoment.length; i++) {
      if (newMoment[i] === moment[i]) {
        equalValuesCount += 1;
      }
    }
    if (equalValuesCount === newMoment.length) return true;
  }
  return false;
};

export const setMomentOnHistory = (moment: number[], history: History) => {
  history.push(moment);
};

export const initializingSteps = (jarList: Jar[]) => {
  return jarList.map(() => []);
};

export const canDrainJar = (jar: Jar, jarList: Jar[], history: History) => {
  if (jar.currentSize > 0) {
    const moment = jarList.map(({ id, currentSize }) =>
      id === jar.id ? 0 : currentSize,
    );
    if (!hasHappened(moment, history)) {
      return moment;
    } else {
      return false;
    }
  }
  return false;
};

export const canFillJar = (jar: Jar, jarList: Jar[], history: History) => {
  if (jar.currentSize < jar.maxSize) {
    const moment = jarList.map(({ id, currentSize }) =>
      id === jar.id ? jar.maxSize : currentSize,
    );
    if (!hasHappened(moment, history)) {
      return moment;
    } else {
      return false;
    }
  }
  return false;
};

export const canTransfer = (
  origin: Jar,
  destiny: Jar,
  jarList: Jar[],
  history: History,
) => {
  if (origin.currentSize) {
    const toTransferSize = destiny.maxSize - destiny.currentSize;

    let originSize = origin.currentSize;
    let destinySize = destiny.currentSize;

    destinySize +=
      destiny.currentSize + origin.currentSize > destiny.maxSize
        ? toTransferSize
        : origin.currentSize;

    originSize -=
      toTransferSize > origin.currentSize ? origin.currentSize : toTransferSize;

    const moment = jarList.map(({ id, currentSize }) => {
      let actualSize = currentSize;
      if (id === origin.id) {
        actualSize = originSize;
      } else if (id === destiny.id) {
        actualSize = destinySize;
      }
      return actualSize;
    });
    if (!hasHappened(moment, history)) {
      return moment;
    } else {
      return false;
    }
  }
  return false;
};

export const hasReachedGoal = (mainJar: Jar, targetSize: number) => {
  return mainJar.currentSize === targetSize;
};

export const transferContent = (jarA: Jar, jarB: Jar, steps: Step[]) => {
  const toTransferSize = jarB.maxSize - jarB.currentSize;

  jarB.currentSize +=
    jarB.currentSize + jarA.currentSize > jarB.maxSize
      ? toTransferSize
      : jarA.currentSize;

  jarA.currentSize -=
    toTransferSize > jarA.currentSize ? jarA.currentSize : toTransferSize;

  steps.push({
    type: "transfer",
    origin: {
      name: jarA.name,
      currentSize: jarA.currentSize,
    },
    destiny: {
      name: jarB.name,
      currentSize: jarB.currentSize,
    },
  });
};

export const drainJar = (jar: Jar, steps: Step[]) => {
  jar.currentSize = 0;

  steps.push({
    type: "drain",
    destiny: {
      name: jar.name,
      currentSize: jar.currentSize,
    },
  });
};

export const fillJar = (jar: Jar, steps: Step[]) => {
  jar.currentSize = jar.maxSize;
  steps.push({
    type: "fill",
    destiny: {
      name: jar.name,
      currentSize: jar.currentSize,
    },
  });
};
