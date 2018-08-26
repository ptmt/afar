/* @flow */
import { AsyncStorage } from "react-native";

const TRAINING_KEY = "log";

export type TrainingSessionData = {
  startDistance?: number,
  endDistance?: number,
  focusPoint?: string,
  startedAt?: Date,
  duration: string,
  id: number
};

export async function reportProgress(sessionData: TrainingSessionData) {
  const trainings = await getAllTimeLog();
  const updatedTrainings = {
    ...trainings,
    [sessionData.id]: sessionData
  };

  await AsyncStorage.setItem(TRAINING_KEY, JSON.stringify(updatedTrainings));
}

export async function getAllTimeLog(): Promise<{
  [string]: TrainingSessionData
}> {
  const savedData = await AsyncStorage.getItem(TRAINING_KEY);
  const trainings = savedData ? JSON.parse(savedData) : {};
  return trainings;
}

export async function getAllTimeLogFlat() {
  const trainings = await getAllTimeLog();
  return Object.values(trainings);
}
