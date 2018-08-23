import { createStackNavigator } from "react-navigation";

import TrainingScreen from "./screens/TrainingScreen";
import MainScreen from "./screens/MainScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SetupFocusScreen from "./screens/SetupFocusScreen";

export default createStackNavigator(
  {
    Main: { screen: MainScreen },
    Training: { screen: TrainingScreen },
    Settings: { screen: SettingsScreen },
    SetupFocus: { screen: SetupFocusScreen }
  },
  {
    headerMode: "float"
  }
);
