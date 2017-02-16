/* @flow */
import { AsyncStorage } from "react-native";

const SETTINGS_KEY = "settings";

export type Settings = {
  dayGoalInMinutes?: number;
};

export async function loadSettings() {
  const json = await AsyncStorage.getItem(SETTINGS_KEY);
  const settings = json ? JSON.parse(json) : {};
  return settings;
}

export async function saveSettings(settings: Settings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
