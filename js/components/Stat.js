import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Bold = props => (
  <Text style={{ fontWeight: "bold", fontSize: 19 }} {...props} />
);

export default function Stat({ label, children }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Bold>{children}</Bold>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowRadius: 10,
    shadowOffset: { x: 3, y: 3 },
    shadowColor: "black",
    shadowOpacity: 0.1,
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
    flex: 1,
    width: "100%",
    marginVertical: 5,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  label: {
    fontSize: 16
  }
});
