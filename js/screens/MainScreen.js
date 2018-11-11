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
import Stat from "../components/Stat";
import StartButton from "../components/StartButton";

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
      .map(t => moment.duration(t.duration).seconds())
      .reduce((a, m) => a + parseInt(m, 10), 0);

    return secondsAll > 0
      ? moment.duration(secondsAll, "seconds").humanize()
      : "00:00";
  }
  spentToday() {
    const spentToday = this.props.screenProps.trainings
      .filter(
        t =>
          moment(t.startedAt)
            .calendar()
            .indexOf("Today") > -1
      )
      .map(t => moment.duration(t.duration).seconds())
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
          <View style={styles.chart}>
            <ProgressChart data={this.props.screenProps.trainings} />
          </View>
          <View style={styles.stats}>
            <Stat label="Daily goal">15 minutes</Stat>
            <Stat label="Trained today">{this.spendTodayFormatted()}</Stat>
            <Stat label="Total time">{this.allTimeSpent()}</Stat>
          </View>
        </ScrollView>
        <SafeAreaView>
          <StartButton title="Start" onPress={() => navigate("Training")} />
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
    paddingHorizontal: 20
  },
  chart: {
    backgroundColor: "white",
    height: 300,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowRadius: 10,
    shadowOffset: { x: 3, y: 3 },
    shadowColor: "black",
    shadowOpacity: 0.1
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

  stats: {
    alignItems: "flex-start"
  }
});
