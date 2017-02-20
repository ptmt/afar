import React from "react";
import {
  Button,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  Switch,
  View,
  TextInput
} from "react-native";

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
  renderFocusPoint() {
    const { focusPoint } = this.props.screenProps.settings;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.preview}>
          <FocusPoint content={focusPoint} />
        </View>
        <TextInput
          autoCorrect={false}
          autoFocus={true}
          defaultValue={focusPoint}
          maxLength={1}
          style={styles.textInput}
        />
        <Text>Recent uses</Text>
        <Text>Featured</Text>
      </View>
    );
  }
  render() {
    const { navigate, state } = this.props.navigation;
    const { settings } = this.props.screenProps;

    if (state.params && state.params.setting === "FocusPoint") {
      return this.renderFocusPoint();
    }

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
              <Switch />
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
