/* @flow */
import { AsyncStorage } from "react-native";

const TRAINING_KEY = "trainings";

export type TrainingSessionData = {
  startDistance?: number,
  endDistance?: number,
  startedAt?: Date,
  endedAt?: Date
};

export async function startTraining(sessionData: TrainingSessionData) {
  const trainingsJSON = await AsyncStorage.getItem(TRAINING_KEY);
  const trainings = trainingsJSON ? JSON.parse(trainingsJSON) : [];
  trainings.push(sessionData);
  await AsyncStorage.setItem(TRAINING_KEY, JSON.stringify(trainings));
}

export async function stopTraining(sessionData: TrainingSessionData) {
  const trainingsJSON = await AsyncStorage.getItem(TRAINING_KEY);
  const trainings = trainingsJSON ? JSON.parse(trainingsJSON) : [{}];
  trainings[trainings.length - 1] = {
    ...trainings[trainings.length - 1],
    ...sessionData
  };
  await AsyncStorage.setItem(TRAINING_KEY, JSON.stringify(trainings));
}

export async function getAllTimeLog() {
  const trainingsJSON = await AsyncStorage.getItem(TRAINING_KEY);
  const trainings = trainingsJSON ? JSON.parse(trainingsJSON) : [];
  return trainings;
}
