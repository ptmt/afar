/**
 * @flow
 */

import React, { Component } from "react";
import { AppRegistry } from "react-native";
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
  }

  async updateGlobalState() {
    const trainings = await getAllTimeLog();
    const settings = await loadSettings();
    this.setState({ trainings, settings });
  }

  async saveSettings(settings: Settings) {
    console.log('settings', settings)
    await saveSettings(settings)
    await this.updateGlobalState()
  }

  render() {
    const screenProps = {
      ...this.state,
      saveSettings: s => this.saveSettings(s)
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
