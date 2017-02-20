import React from "react";
import {
  Button,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  Switch,
  View
} from "react-native";

import moment from "moment";

import {
  Cell,
  CustomCell,
  Section,
  TableView
} from "react-native-tableview-simple";

import ProgressChart from "../components/ProgressChart";

const Bold = props => <Text style={{ fontWeight: 'bold'}} {...props} />

export default class MainScreen extends React.Component {
  static navigationOptions = {
    title: "Eagle Eye",
    header: ({ navigate }) => ({
      right: <Button title={"Settings"} onPress={() => navigate("Settings")} />
    })
  };
  allTimeSpent() {
    const minutesToday = this.props.screenProps.trainings
      .filter(t => moment(t.startedAt).calendar().indexOf("Today") > -1)
      .map(t => moment(t.endedAt).diff(moment(t.startedAt), "seconds"));

    return minutesToday.reduce((a, m) => a + parseInt(m, 10), 0);
  }
  spentToday() {
    const spentToday = this.props.screenProps.trainings
      .filter(t => moment(t.startedAt).calendar().indexOf("Today") > -1)
      .map(t => moment(t.endedAt).diff(moment(t.startedAt), "seconds"));

    return spentToday.reduce((a, m) => a + parseInt(m, 10), 0);
  }
  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* <Text style={styles.header}>Statistics</Text> */}
          <View style={styles.chart}>
            <ProgressChart data={this.props.screenProps.trainings} />
          </View>
          <Text style={styles.text}>
            Today you've trained so far:{" "}
              <Bold>
                {moment.duration(this.spentToday(), 'seconds').minutes()}:
                {moment.duration(this.spentToday(), 'seconds').seconds()}
              </Bold>
          </Text>
          <Text style={styles.text}>
            Daily goal: <Bold>15 minutes</Bold>
          </Text>
          <Text style={styles.text}>
            Total:{" "}
            <Bold>{moment.duration(this.allTimeSpent(), "seconds").humanize()}</Bold>
          </Text>
        </ScrollView>
        <View style={styles.button}>
          <Button
            title="Start training"
            onPress={() => navigate("Training", { name: "Jane" })}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#EFEFF4",
    flex: 1
  },
  scroll: {
    padding: 10
  },
  chart: {
    // backgroundColor: 'white',
    height: 300,
    marginTop: 5,
    marginBottom: 30,
  },
  header: {
    marginHorizontal: 10,
    fontSize: 20
  },
  text: {
    marginHorizontal: 10,
    lineHeight: 30,
    color: "#555",
    fontSize: 16,
  },
  button: {
    padding: 20,
    backgroundColor: "white"
  }
});
