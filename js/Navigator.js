import { createStackNavigator, createAppContainer } from "react-navigation";

import TrainingScreen from "./screens/TrainingScreen";
import MainScreen from "./screens/MainScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SetupFocusScreen from "./screens/SetupFocusScreen";
import TextToRead from "./screens/TextToRead";

export default createAppContainer(
  createStackNavigator(
    {
      Main: { screen: MainScreen },
      Training: { screen: TrainingScreen },
      Settings: { screen: SettingsScreen },
      SetupFocus: { screen: SetupFocusScreen },
      TextToRead: { screen: TextToRead }
    },
    {
      headerMode: "float"
    }
  )
);
