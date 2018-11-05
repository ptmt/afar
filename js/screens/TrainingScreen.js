// @flow
import React, { Component } from "react";
import {
  AppRegistry,
  AppState,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  Button
} from "react-native";
import Orientation from "react-native-orientation";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import { throttle } from "throttle-debounce";

import { type Settings } from "../data/settings";
import { getAllTimeLog, reportProgress } from "../data/log";
import Notification from "../components/Notification";
import FocusPoint from "../components/FocusPoint";
import startTracking from "../distanceTracking";
import FaceTrackingView from "../components/FaceTrackingView";

const window = Dimensions.get("window");
const WIDTH = window.width > window.height ? window.width : window.height;

function formatTime(duration) {
  const m = duration.minutes();
  const s = duration.seconds();
  const format = d => (String(d).length === 1 ? `0${d}` : d);
  return `${format(m)}:${format(s)}`;
}

type Props = {
  screenProps: {
    settings: Settings
  },
  navigation: {
    goBack: Function
  }
};
type State = {
  distance: number,
  duration: any,
  pause: boolean,
  screenToEyes: number,
  initialized: boolean
};

export default class TrainingScreen extends Component<Props, State> {
  static navigationOptions = {
    header: null
  };

  moving: boolean;
  triggerOnDistanceChangeThrottled: Function;

  constructor() {
    super();
    this.state = {
      distance: 150,
      pause: true,
      initialized: false,
      duration: moment.duration(0),
      screenToEyes: 0
    };
    this.moving = false;
    this.triggerOnDistanceChangeThrottled = throttle(
      300,
      this.triggerOnDistanceChange
    );
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
        if (Math.abs(gestureState.dy) > 0) {
          this.moving = true;
          if (this.state.distance >= 1) {
            if (this.state.distance > 450) {
              this.setState({ distance: 450 });
            } else {
              this.setState({
                distance: this.state.distance - gestureState.dy / 2
              });
            }
          } else {
            this.setState({ distance: 1 });
          }
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, { dx, dy }) => {
        if (!this.moving) {
          this.toggleMoving(dx, dy);
        } else {
          this.moving = false;
        }
      },
      onPanResponderTerminate: (evt, { dx, dy }) => {
        if (!this.moving) {
          this.toggleMoving(dx, dy);
        } else {
          this.moving = false;
        }
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return false;
      }
    });
  }
  interval: any;
  panResponder: any;
  componentDidMount() {
    this.setState({ initialized: true });
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
  async startMoving() {
    const id = Object.keys(await getAllTimeLog()).length;
    const startedAt = new Date();
    const startDistance = this.state.distance;
    this.setState({ pause: false }, () => this.moveCircle());
    this.interval = setInterval(() => {
      const duration = this.state.duration.add(moment.duration(1, "s"));
      this.setState({
        duration
      });
      reportProgress({
        id,
        startedAt,
        duration: duration.toJSON(),
        startDistance,
        endDistance: this.state.distance
      });
    }, 1000);
  }
  stopMoving() {
    clearInterval(this.interval);
    this.setState({ pause: true });
  }
  goBack() {
    const { goBack } = this.props.navigation;
    this.stopMoving();
    setTimeout(() => goBack(), 100);
  }
  onDistanceChange(e: any) {
    this.setState(
      { screenToEyes: Math.round(100 * e.nativeEvent.distance) },
      () => {
        this.triggerOnDistanceChangeThrottled();
      }
    );
  }
  triggerOnDistanceChange() {
    console.log("throttle");
    if (
      this.state.pause &&
      this.state.screenToEyes > 45 &&
      this.state.screenToEyes < 50
    ) {
      this.startMoving();
    } else if (
      (!this.state.pause && this.state.screenToEyes < 45) ||
      this.state.screenToEyes > 50
    ) {
      this.stopMoving();
    }
  }

  render() {
    const { settings } = this.props.screenProps;

    const borderStyles = this.state.pause
      ? styles.redBorder
      : styles.greenBorder;

    const content =
      settings.textToRead != null
        ? settings.texts[settings.textToRead]
        : settings.focusPoint;

    return (
      <SafeAreaView
        style={[StyleSheet.absoluteFill, styles.container, borderStyles]}
        {...this.panResponder.panHandlers}
      >
        <Notification
          text={this.state.pause ? "Paused" : ""}
          screenToEyes={this.state.screenToEyes}
        />
        <View style={styles.points}>
          <FocusPoint
            content={content}
            text={!!settings.textToRead}
            pause={this.state.pause}
            width={this.state.distance / 2}
          />
          <View style={{ width: this.state.distance / 2 }} />
          <FocusPoint
            content={content}
            text={!!settings.textToRead}
            pause={this.state.pause}
            width={this.state.distance / 2}
          />
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
            {/* <Text style={styles.stats}>
                Distance: {Math.round(this.state.distance)}
              </Text> */}
            <TouchableOpacity
              onPress={() => this.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 20 }}
            >
              <Text style={styles.stats}>Instructions</Text>
            </TouchableOpacity>
          </View>
        )}
        {this.state.initialized &&
          settings.faceTracker && (
            <FaceTrackingView
              style={styles.faceArea}
              onDistanceChange={e => this.onDistanceChange(e)}
            />
          )}
      </SafeAreaView>
    );
  }
}

const backgroundColor = "#FFFDD6";
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 15
  },
  redBorder: {
    borderColor: "#FFEF79"
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
    color: "#777",
    marginBottom: 5
  },
  header: {
    flexDirection: "row",
    paddingLeft: 25,
    paddingRight: 25,
    justifyContent: "space-between",
    position: "absolute",
    alignItems: "center",
    // flex: 1,
    width: WIDTH,
    top: 10
  },
  faceArea: {
    position: "absolute",
    right: 40,
    top: 50,
    width: 100,
    height: 100,
    backgroundColor: "lightgray",
    opacity: 0
  }
});
