/* @flow */
import { AsyncStorage } from "react-native";

const SETTINGS_KEY = "settings";
export const DEFAULT_SETTINGS = {
  focusPoint: "🔘"
};
export type Settings = {
  dayGoalInMinutes?: number,
  reminder?: Boolean,
  focusPoint: string,
  textToRead?: string,
  texts: Array<string>,
  faceTracker?: Boolean
};

export async function loadSettings() {
  const json = await AsyncStorage.getItem(SETTINGS_KEY);
  const settings = json ? JSON.parse(json) : DEFAULT_SETTINGS;
  return settings;
}

export async function saveSettings(settings: Settings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
