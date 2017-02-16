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

import { startTraining, stopTraining } from '../data/log'

const FocusPoint = ({ distance }) => <View style={styles.circle} />;

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
      pause: true
    };
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
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
    distance: number
  };
  componentDidMount() {
    Orientation.lockToLandscapeLeft();
    AppState.addEventListener('change', this.handleAppStateChange);
    this.handleAppStateChange('active')
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.handleAppStateChange('inactive')
  }
  handleAppStateChange(currentAppState) {
    if (currentAppState === 'active') {
      startTraining({ startDistance: this.state.distance, startedAt: new Date() })
    } else {
      stopTraining({ endDistance: this.state.distance, endedAt: new Date()  })
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
  toggleMoving(dx, dy) {
    if (dx < 1 && dy < 1) {
      if (this.state.pause) {
        this.startMoving();
      } else {
        this.stopMoving();
      }
    }
  }
  startMoving() {
    this.setState({ pause: false }, () => this.moveCircle());
  }
  stopMoving() {
    this.setState({ pause: true });
  }
  render() {
    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <View style={styles.points}>
          <FocusPoint />
          <View style={{ width: this.state.distance }} />
          <FocusPoint />
        </View>
        <Text>00:00, Distance: {Math.round(this.state.distance)}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
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
  }
});
