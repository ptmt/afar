/* @float */
import React from "react";
import { View, StyleSheet, Animated, Text } from "react-native";

export default class Notification extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      scale: new Animated.Value(1)
    };
  }
  componentDidMount() {
    this.show();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.text !== this.props.text) {
      if (this.props.text === "") {
        this.hide();
      } else {
        this.show();
      }
    }
  }
  show() {
    Animated.timing(this.state.scale, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true
    }).start();
  }
  hide() {
    // Animated.timing(this.state.scale, {
    //   toValue: 0,
    //   duration: 300,
    //   useNativeDriver: true
    // }).start();
  }
  render() {
    const { scale } = this.state;
    const opacity = scale.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.5]
    });
    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.container,
          { opacity, transform: [{ scaleX: scale }, { scaleY: scale }] }
        ]}
      >
        <Text style={styles.h1}>{this.props.text}</Text>
        <Text style={styles.subtitle}>
          {this.props.text
            ? `Dobule tap to continue or move your phone ${
                this.props.screenToEyes > 50
                  ? "closer to your eyes"
                  : "away from your eyes"
              }`
            : ""}
        </Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //top: "5%",
    position: "absolute",
    flex: 1,
    justifyContent: "space-between",
    marginTop: 20,
    marginVertical: 80,
    alignItems: "center",
    backgroundColor: "transparent"
  },
  h1: {
    fontSize: 60,
    color: "#777",
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 20,
    color: "#555"
  }
});
