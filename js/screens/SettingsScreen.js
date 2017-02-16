import React from "react";
import {
  Button,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  Switch,
  View,
} from "react-native";

import {
  Cell,
  CustomCell,
  Section,
  TableView
} from "react-native-tableview-simple";

export default class MainScreen extends React.Component {
  static navigationOptions = {
    title: "Settings"
  };
  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.stage}>
        <TableView>
          <Section header="SETTINGS">
            <Cell
              cellStyle="RightDetail"
              accessory="DisclosureIndicator"
              detail="15 minutes"
              title="Total time per day"
              onPress={() => navigate("Settings", {})}
            />
            <CustomCell>
              <Text style={{ flex: 1, fontSize: 16 }}>Enable reminders</Text>
              <Switch />
            </CustomCell>
            <Cell
              cellStyle="RightDetail"
              accessory="DisclosureIndicator"
              title="Focus Points"
              detail="A"
            />
          </Section>

        </TableView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  stage: {
    backgroundColor: "#ddd",
    paddingTop: 1,
    // paddingBottom: 20
  }
});
