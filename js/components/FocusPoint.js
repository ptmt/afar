/* @flow */
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  content: string,
  text?: boolean,
  pause?: boolean,
  textAlign?: "left" | "right" | "center"
};
const StaticFocusPoint = ({ content, textAlign = "center" }: Props) => (
  <Text
    style={[styles.focusPoint, { textAlign }]}
    adjustsFontSizeToFit={true}
    numberOfLines={1}
  >
    {content}
  </Text>
);

type State = {
  i: number,
  tokens: Array<string>
};

function tokenize(s: string): Array<string> {
  return s.split(/[\s,]+/);
}

class DynamicTextFocusPoint extends React.Component<Props, State> {
  constructor(props) {
    super();
    this.state = {
      i: 0,
      tokens: tokenize(props.content)
    };
    if (!props.pause) {
      this.start();
    }
  }

  interval: IntervalID;
  start() {
    this.interval = setInterval(() => {
      this.setState({
        i: this.state.i > this.state.tokens.length - 1 ? 0 : this.state.i + 1
      });
    }, 500);
  }
  componentDidUpdate(prevProps, state) {
    if (prevProps.content != this.props.content) {
      this.setState({
        i: 0,
        tokens: tokenize(this.props.content)
      });
    }
    if (this.props.pause != prevProps.pause) {
      if (this.props.pause) {
        clearInterval(this.interval);
      } else {
        clearInterval(this.interval);
        this.start();
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    if (this.state.tokens.length == 0) {
      return null;
    }
    return (
      <StaticFocusPoint
        content={this.state.tokens[this.state.i]}
        textAlign={this.props.textAlign}
      />
    );
  }
}

export default (props: Props) =>
  props.text ? (
    <DynamicTextFocusPoint {...props} />
  ) : (
    <StaticFocusPoint {...props} />
  );

const styles = StyleSheet.create({
  focusPoint: {
    fontSize: 80,
    width: 200
  }
});
