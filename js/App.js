/* @flow */

import React, { Component } from "react";
import { AppRegistry, PushNotificationIOS } from "react-native";
import Orientation from "react-native-orientation";

import { getAllTimeLog } from "./data/log";
import type { TrainingSessionData } from "./data/log";
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from "./data/settings";
import type { Settings } from "./data/settings";
import AppNavigator from "./Navigator";

Orientation.lockToPortrait();

const screenName = navState => {
  return navState ? navState.routes[navState.index].routeName : void 0;
};

class AfarApp extends React.Component {
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

  componentDidMount() {
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
    if (this.state.settings.reminder) {
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
      <AppNavigator
        screenProps={screenProps}
        onUpdate={() => this.updateGlobalState()}
        onNavigationStateChange={(prevState, currentState) => {
          const currScreen = screenName(currentState);
          const prevScreen = screenName(prevState.nav);
          if (
            !!currScreen &&
            currScreen != prevScreen &&
            currScreen !== "Training"
          ) {
            Orientation.lockToPortrait();
          }
        }}
      />
    );
  }
}

export default () => AppRegistry.registerComponent("afar", () => AfarApp);
