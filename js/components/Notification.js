/* @float */
import React from "react";
import { View, StyleSheet, Animated, Text } from "react-native";

export default class Notification extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      scale: new Animated.Value(0)
    };
  }
  componentDidMount() {
    this.show();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.props.text) {
      this.show();
    }
  }
  show() {
    Animated
      .spring(this.state.scale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      })
      .start(() => this.state.scale.setValue(0));
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
        <Text style={{ fontSize: 60 }}>{this.props.text}</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    top: -200,
    position: "absolute",
    // : 1,
    alignItems: "center",
    // top: 50,
    backgroundColor: "transparent"
  }
});
