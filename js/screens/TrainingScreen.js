// @flow
import React, { Component } from "react";
import {
  AppRegistry,
  AppState,
  StyleSheet,
  Text,
  View,
  PanResponder
} from "react-native";
import Orientation from "react-native-orientation";
import moment from "moment";

import { startTraining, stopTraining } from "../data/log";
import Notification from "../components/Notification";

const FocusPoint = ({ distance }) => <View style={styles.circle} />;

function formatTime(duration) {
  const m = duration.minutes();
  const s = duration.seconds();
  const format = d => String(d).length === 1 ? `0${d}` : d;
  return `${format(m)}:${format(s)}`
}

export default class TrainingScreen extends Component {
  static navigationOptions = {
    header: {
      visible: false
    }
  };
  constructor() {
    super();
    this.state = {
      distance: 150,
      pause: true,
      duration: moment.duration(0)
    };
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        if (gestureState.numberActiveTouches === 2) {
          this.stopMoving();
          setTimeout(() => this.props.navigation.goBack(), 100);
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (this.state.distance >= 1) {
          this.setState({
            distance: this.state.distance - gestureState.vy * 20
          });
        } else {
          this.setState({ distance: 1 });
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, { dx, dy }) => {
        this.toggleMoving(dx, dy);
      },
      onPanResponderTerminate: (evt, { dx, dy }) => {
        this.toggleMoving(dx, dy);
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      }
    });
  }
  state: {
    distance: number,
    duration: any,
    pause: boolean
  };
  interval: any;
  panResponder: any;
  componentDidMount() {
    Orientation.lockToLandscapeLeft();
    AppState.addEventListener("change", this.handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
    this.handleAppStateChange("inactive");
  }
  handleAppStateChange(currentAppState: any) {
    if (currentAppState !== "active") {
      this.stopMoving();
    }
  }
  moveCircle() {
    if (this.state.pause) {
      return;
    }
    if (this.state.distance > 450) {
      return;
    }
    if (this.state.distance <= 1) {
      return;
    }
    setTimeout(
      () =>
        this.setState(
          { distance: this.state.distance + 0.5 },
          () => this.moveCircle()
        ),
      1500
    );
  }
  toggleMoving(dx: number, dy: number) {
    if (dx < 1 && dy < 1) {
      if (this.state.pause) {
        this.startMoving();
      } else {
        this.stopMoving();
      }
    }
  }
  startMoving() {
    startTraining({
      startDistance: this.state.distance,
      startedAt: new Date()
    });
    this.setState({ pause: false }, () => this.moveCircle());
    this.interval = setInterval(
      () => this.setState({
        duration: this.state.duration.add(moment.duration(1, "s"))
      }),
      1000
    );
  }
  stopMoving() {
    clearInterval(this.interval);
    stopTraining({ endDistance: this.state.distance, endedAt: new Date() });
    this.setState({ pause: true });
  }
  render() {
    const borderStyles = this.state.pause
      ? styles.redBorder
      : styles.greenBorder;

    return (
      <View
        style={[styles.container, borderStyles]}
        {...this.panResponder.panHandlers}
      >
        <Notification text={this.state.pause ? "Pause" : "Play"} />
        <View style={styles.points}>
          <FocusPoint />
          <View style={{ width: this.state.distance }} />
          <FocusPoint />
        </View>
        <Text style={styles.stats}>
          Time:{" "}
          {formatTime(this.state.duration)}, Distance:{" "}
          {Math.round(this.state.distance)}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    borderWidth: 5
  },
  redBorder: {
    borderColor: "salmon"
  },
  greenBorder: {
    borderColor: "#99ffcc"
  },
  points: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  circle: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    height: 70,
    width: 70,
    borderRadius: 35
  },
  stats: {
    fontWeight: "300",
    color: "#555"
  }
});
