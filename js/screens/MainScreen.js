import React from "react";
import {
  Button,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  Switch,
  View,
  SafeAreaView
} from "react-native";

import moment from "moment";

import {
  Cell,
  CustomCell,
  Section,
  TableView
} from "react-native-tableview-simple";

import padStart from "pad-start";

import ProgressChart from "../components/ProgressChart";

const Bold = props => <Text style={{ fontWeight: "bold" }} {...props} />;

export default class MainScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Afar",
    headerRight: (
      <Button
        title={"Settings"}
        onPress={() => navigation.navigate("Settings")}
      />
    )
  });
  allTimeSpent() {
    const secondsAll = this.props.screenProps.trainings
      .map(t => moment(t.endedAt).diff(moment(t.startedAt), "seconds"))
      .reduce((a, m) => a + parseInt(m, 10), 0);

    return secondsAll > 0
      ? moment.duration(secondsAll, "seconds").humanize()
      : "None";
  }
  spentToday() {
    const spentToday = this.props.screenProps.trainings
      .filter(
        t =>
          moment(t.startedAt)
            .calendar()
            .indexOf("Today") > -1
      )
      .map(t => moment(t.endedAt).diff(moment(t.startedAt), "seconds"))
      .reduce((a, m) => a + parseInt(m, 10), 0);

    return Math.max(0, spentToday);
  }
  spendTodayFormatted() {
    const spendSecondsToday = moment.duration(this.spentToday(), "seconds");
    return `${padStart(spendSecondsToday.minutes(), 2, "0")}:${padStart(
      spendSecondsToday.seconds(),
      2,
      "0"
    )}`;
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
            Trained today: <Bold>{this.spendTodayFormatted()}</Bold>
          </Text>
          <Text style={styles.text}>
            Daily goal: <Bold>15 minutes</Bold>
          </Text>
          <Text style={styles.text}>
            Total: <Bold>{this.allTimeSpent()}</Bold>
          </Text>
        </ScrollView>
        <SafeAreaView style={styles.button}>
          <Button
            title="Start training"
            onPress={() => navigate("Training", { name: "Jane" })}
          />
        </SafeAreaView>
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
    marginBottom: 30
  },
  header: {
    marginHorizontal: 10,
    fontSize: 20
  },
  text: {
    marginHorizontal: 10,
    lineHeight: 30,
    color: "#555",
    fontSize: 16
  },
  button: {
    padding: 20,
    backgroundColor: "white"
  }
});
