/* @flow */
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { lighten, desaturate } from "polished";
import themes from "../themes";

const Bold = props => (
  <Text
    style={{ fontWeight: "bold", fontSize: 19, color: themes.alternateColor }}
    {...props}
  />
);

export default function StartButton({ onPress, title }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        style={styles.container}
        colors={[themes.tintColor, lighten(0.1, themes.tintColor)]}
      >
        <Bold>{title}</Bold>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowRadius: 10,
    shadowOffset: { x: 3, y: 3 },
    shadowColor: "black",
    shadowOpacity: 0.1,
    padding: 14,
    margin: 20,
    borderRadius: 10,
    // flex: 1,
    // // width: "100%",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center"
    // backgroundColor: themes.tintColor
  },
  label: {
    fontSize: 16
  }
});
