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
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        style={styles.gradient}
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
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "black",
    shadowOpacity: 0.2,
    margin: 20,
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: themes.tintColor
  },
  gradient: {
    padding: 14,
    justifyContent: "center",
    alignItems: "center"
  },
  label: {
    fontSize: 16
  }
});
