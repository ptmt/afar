// @flow
import React, { Component } from "react";
import {
  AppRegistry,
  AppState,
  StyleSheet,
  Text,
  View,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  Button
} from "react-native";
import Orientation from "react-native-orientation";
import moment from "moment";

import { startTraining, stopTraining } from "../data/log";
import Notification from "../components/Notification";
import FocusPoint from "../components/FocusPoint";

const window = Dimensions.get("window");
const WIDTH = window.width > window.height ? window.width : window.height;

function formatTime(duration) {
  const m = duration.minutes();
  const s = duration.seconds();
  const format = d => (String(d).length === 1 ? `0${d}` : d);
  return `${format(m)}:${format(s)}`;
}

export default class TrainingScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor() {
    super();
    this.state = {
      distance: 150,
      pause: true,
      duration: moment.duration(0)
    };
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) =>
        gestureState.numberActiveTouches === 2,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        gestureState.numberActiveTouches === 2,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onPanResponderGrant: (evt, gestureState) => {
        // if (gestureState.numberActiveTouches === 2) {
        //   this.stopMoving();
        //   setTimeout(() => this.props.navigation.goBack(), 100);
        // }
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
        return false;
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
    AppState.addEventListener("change", this.handleAppStateChange.bind(this));
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
        this.setState({ distance: this.state.distance + 0.5 }, () =>
          this.moveCircle()
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
      () =>
        this.setState({
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
  goBack() {
    const { goBack } = this.props.navigation;
    this.stopMoving();
    setTimeout(() => goBack(), 100);
  }
  render() {
    const { settings } = this.props.screenProps;

    const borderStyles = this.state.pause
      ? styles.redBorder
      : styles.greenBorder;

    return (
      <View
        style={[StyleSheet.absoluteFill, styles.container, borderStyles]}
        {...this.panResponder.panHandlers}
      >
        <Notification text={this.state.pause ? "Paused" : ""} />
        <View style={styles.points}>
          <FocusPoint content={settings.focusPoint} />
          <View style={{ width: this.state.distance }} />
          <FocusPoint content={settings.focusPoint} />
        </View>
        <Text style={styles.stats}>{formatTime(this.state.duration)}</Text>
        {this.state.pause && (
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => this.goBack()}
              hitSlop={{ top: 10, bottom: 40, left: 10, right: 40 }}
            >
              <Text style={styles.stats}>Back</Text>
            </TouchableOpacity>
            {/* <Text style={styles.stats}>Distance: {Math.round(this.state.distance)}</Text> */}
            <TouchableOpacity
              onPress={() => this.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 20 }}
            >
              <Text style={styles.stats}>Instructions</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    borderWidth: 10
  },
  redBorder: {
    borderColor: "#F5FCFF"
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
  stats: {
    // fontWeight: "300",
    fontSize: 18,
    color: "#777"
  },
  header: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 20,
    justifyContent: "space-between",
    position: "absolute",
    alignItems: "center",
    // flex: 1,
    width: WIDTH,
    top: 0
  }
});
