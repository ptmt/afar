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

import moment from 'moment'

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
    this.props.screenProps.updateSettings({ reminder: !reminder })
    if (!reminder) {
      const res = await PushNotificationIOS.requestPermissions();
      if (res) {
        this.props.screenProps.scheduleNotification()
      }
    }
  }
  render() {
    const { navigate, state } = this.props.navigation;
    const { settings } = this.props.screenProps;

    return (
      <View style={styles.stage}>
        <TableView>
          <Section header=" ">
            <Cell
              cellStyle="RightDetail"
              accessory="DisclosureIndicator"
              detail="15 minutes"
              title="Daily goal"
              onPress={() => navigate("Settings", {})}
            />
            <CustomCell>
              <Text style={{ flex: 1, fontSize: 16 }}>Enable reminders</Text>
              <Switch onChange={() => this.setupNotifications() } value={settings.reminder} />
            </CustomCell>
            <Cell
              cellStyle="RightDetail"
              accessory="DisclosureIndicator"
              title="Focus Point"
              detail={settings.focusPoint}
              onPress={() => navigate("SetupFocus")}
            />
          </Section>
          <Section header=" ">
            <Cell
              cellStyle="RightDetail"
              accessory="DisclosureIndicator"
              title="Help"
              onPress={() => navigate("Settings", {})}
            />
            <Cell
              cellStyle="RightDetail"
              accessory="DisclosureIndicator"
              title="About"
              onPress={() => navigate("Settings", {})}
            />
          </Section>
        </TableView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  stage: {
    // backgroundColor: "#ddd",
    flex: 1,
    paddingTop: 1
    // paddingBottom: 20
  },
});
