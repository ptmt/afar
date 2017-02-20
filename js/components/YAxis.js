/* @float */
import React from "react";
import { View, Dimensions } from "react-native";
import moment from "moment";

import { Svg, Path, G, Text, Line } from "react-native-svg";
import { range as d3range } from "d3-array";

const HEIGHT = 300;
const WIDTH = Dimensions.get("window").width;
const NUMBER_OF_TICKS = 5;

function getTicks(scale, labelFunc) {
  const range = scale.range();
  const domain = scale.domain();
  const a = [domain[0], domain[1]];
  const r = d3range(a[0], a[1], (a[1] - a[0]) / NUMBER_OF_TICKS);
  return r.map((d, i) => ({
    y: scale(d),
    label: labelFunc ? labelFunc(Math.round(d)) : Math.round(d)
  })).slice(1);
}

const Tick = ({ data: { y, label }, color, offset = 0 }) => {
  return (
    <G x={offset} y={y}>
      <Text
        x={0}
        y={20}
        fill={color}
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
      >
        {String(label)}
      </Text>
    </G>
  );
};

export default function YAxis(
  { yScale, color, marginLeft, marginTop, offset = 0, labelFunc, label }
) {
  return (
    <G x={marginLeft} y={marginTop}>
      {getTicks(yScale, labelFunc).map((d, i) => (
        <Tick color={color} key={i} data={d} offset={offset} />
      ))}
      <Text
        x={offset - 10}
        y={20}
        fill={color}
        textAnchor="start"
        fontSize="10"
        fontWeight="700"
      >
        {String(label)}
      </Text>
    </G>
  );
}
