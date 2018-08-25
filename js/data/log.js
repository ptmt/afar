/* @flow */
import { AsyncStorage } from "react-native";

const TRAINING_KEY = "log";

export type TrainingSessionData = {
  startDistance?: number,
  endDistance?: number,
  focusPoint: String,
  startedAt?: Date,
  duration: String,
  id: Number
};

export async function reportProgress(sessionData: TrainingSessionData) {
  const trainings = await getAllTimeLog();
  const updatedTrainings = {
    ...trainings,
    [sessionData.id]: sessionData
  };
  console.log(sessionData);
  await AsyncStorage.setItem(TRAINING_KEY, JSON.stringify(updatedTrainings));
}

export async function getAllTimeLog(): Map<String, TrainingSessionData> {
  const savedData = await AsyncStorage.getItem(TRAINING_KEY);
  const trainings = savedData ? JSON.parse(savedData) : {};
  return trainings;
}

export async function getAllTimeLogFlat(): Array<TrainingSessionData> {
  const trainings = await getAllTimeLog();
  console.log(trainings);
  return Object.values(trainings);
}
