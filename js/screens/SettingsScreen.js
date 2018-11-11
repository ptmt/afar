import React from "react";
import {
  Button,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  Switch,
  View,
  TextInput,
  PushNotificationIOS
} from "react-native";

import moment from "moment";

import {
  Cell,
  CustomCell,
  Section,
  TableView
} from "react-native-tableview-simple";

import FocusPoint from "../components/FocusPoint";

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: "Settings"
  };
  async setupNotifications() {
    const { reminder } = this.props.screenProps.settings;
    this.props.screenProps.updateSettings({ reminder: !reminder });
    if (!reminder) {
      const res = await PushNotificationIOS.requestPermissions();
      if (res) {
        this.props.screenProps.scheduleNotification();
      }
    }
  }
  toggleFaceDistance() {
    const { faceTracker } = this.props.screenProps.settings;
    this.props.screenProps.updateSettings({ faceTracker: !faceTracker });
  }
  render() {
    const { navigate, state } = this.props.navigation;
    const { settings } = this.props.screenProps;

    return (
      <ScrollView
        contentContainerStyle={[
          StyleSheet.absoluteFill,
          { backgroundColor: "rgb(239, 239, 244)" }
        ]}
      >
        <TableView style={{ flex: 1 }}>
          <Section header="Notifications">
            <Cell
              cellStyle="RightDetail"
              accessory="DisclosureIndicator"
              detail="15 minutes"
              title="Daily goal"
              onPress={() => navigate("Settings", {})}
            />
            <Cell
              title="Reminder"
              cellAccessoryView={
                <Switch
                  onChange={() => this.setupNotifications()}
                  value={settings.reminder}
                />
              }
              contentContainerStyle={{ paddingVertical: 4 }} // Adjust height
            />
          </Section>
          <Section header="Experimental">
            <Cell
              title="Face-distance activation (experimental)"
              cellAccessoryView={
                <Switch
                  onChange={() => this.toggleFaceDistance()}
                  value={settings.faceTracker}
                />
              }
              contentContainerStyle={{ paddingVertical: 4 }} // Adjust height
            />
          </Section>
          <Section header="Focus">
            <Cell
              cellStyle="RightDetail"
              accessory="DisclosureIndicator"
              title="Static Focus Point"
              detail={settings.focusPoint}
              onPress={() => navigate("SetupFocus")}
            />

            <Cell
              cellStyle="RightDetail"
              accessory="DisclosureIndicator"
              title="Texts"
              detail={
                settings.textToRead
                  ? settings.texts[settings.textToRead]
                  : "Not set"
              }
              onPress={() => navigate("TextToRead")}
            />
          </Section>
          <Section header=" ">
            <Cell
              cellStyle="RightDetail"
              accessory="DisclosureIndicator"
              title="Help"
              onPress={() => navigate("Intro", {})}
            />
            {/* <Cell
              cellStyle="RightDetail"
              accessory="DisclosureIndicator"
              title="About"
              onPress={() => navigate("Settings", {})}
            /> */}
          </Section>
        </TableView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    paddingTop: 1
    // paddingBottom: 20
  }
});
