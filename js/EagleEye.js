/* @flow */

import React, { Component } from "react";
import { AppRegistry, PushNotificationIOS } from "react-native";
import Orientation from "react-native-orientation";
import { StackNavigator } from "react-navigation";

import TrainingScreen from "./screens/TrainingScreen";
import MainScreen from "./screens/MainScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SetupFocusScreen from "./screens/SetupFocusScreen";

import { getAllTimeLog } from "./data/log";
import type { TrainingSessionData } from "./data/log";
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from "./data/settings";
import type { Settings } from "./data/settings";

Orientation.lockToPortrait();

const EagleEyeNavigator = StackNavigator(
  {
    Main: { screen: MainScreen },
    Training: { screen: TrainingScreen },
    Settings: { screen: SettingsScreen },
    SetupFocus: { screen: SetupFocusScreen }
  },
  {
    headerMode: "screen"
  }
);

const screenName = navState => {
  return navState ? navState.routes[navState.index].routeName : void 0;
};

EagleEyeNavigator.prototype.componentDidUpdate = function(
  prevProps,
  prevState
) {
  const currScreen = screenName(this.state.nav);
  const prevScreen = screenName(prevState.nav);
  if (!!currScreen && currScreen != prevScreen && currScreen !== "Training") {
    prevProps.onUpdate();
    Orientation.lockToPortrait();
  }
};

class EagleEyeApp extends React.Component {
  state: {
    trainings: Array<TrainingSessionData>,
    settings: Settings
  };
  constructor() {
    super();
    this.state = {
      trainings: [],
      settings: DEFAULT_SETTINGS
    };
  }

  componentWillMount() {
    this.updateGlobalState();
    this.scheduleNotification();
  }

  async updateGlobalState() {
    const trainings = await getAllTimeLog();
    const settings = await loadSettings();
    this.setState({ trainings, settings });
  }

  async updateSettings(settings: Settings) {
    await saveSettings({ ...this.state.settings, ...settings });
    await this.updateGlobalState();
  }

  async scheduleNotification() {
    if (this.settings.reminder) {
      await PushNotificationIOS.cancelAllLocalNotifications();
      PushNotificationIOS.scheduleLocalNotification({
        fireDate: moment().add(3, "hours"),
        alertBody: "Don't forget to relax and make an exercise for your eyes"
      });
    }
  }

  render() {
    const screenProps = {
      ...this.state,
      updateSettings: s => this.updateSettings(s),
      scheduleNotification: () => this.scheduleNotification()
    };
    return (
      <EagleEyeNavigator
        screenProps={screenProps}
        onUpdate={() => this.updateGlobalState()}
      />
    );
  }
}

export default () =>
  AppRegistry.registerComponent("eagleeye", () => EagleEyeApp);
