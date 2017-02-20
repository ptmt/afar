/* @flow */
import React from "react";
import { Text, StyleSheet } from 'react-native';

const FocusPoint = ({ content }: { content: string }) => (
  <Text style={styles.focusPoint}>{content}</Text>
);

export default FocusPoint;


const styles = StyleSheet.create({
  focusPoint: {
    fontSize: 80,
  },
})
