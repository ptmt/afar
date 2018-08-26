/* @flow */
import React from "react";
import { View, Dimensions } from "react-native";
import moment from "moment";

import { Svg, Path, G, Text, Line } from "react-native-svg";
import { range as d3range } from "d3-array";

const HEIGHT = 300;
const NUMBER_OF_TICKS = 6;

function getTicks(scale) {
  const range = scale.range();
  const domain = scale.domain();

  const a = [moment(domain[0]).valueOf(), moment(domain[1]).valueOf()];
  const r = d3range(a[0], a[1], (a[1] - a[0]) / NUMBER_OF_TICKS);

  return r.map((d, i) => ({
    x: scale(d),
    label: moment(d).format("MMM D")
  }));
}

const Tick = ({ data: { x, label }, margin }) => {
  return (
    <G x={x} y={HEIGHT - margin.top - margin.bottom - 8}>
      <Line
        strokeWidth="0.5"
        stroke="#888"
        x1={0}
        y1={5}
        x2={0}
        y2={-HEIGHT + 20}
        strokeDasharray={[5, 7]}
        strokeLinecap="round"
      />

      <Text x={0} y={7} fill="#444" textAnchor="middle" fontSize="10">
        {String(label)}
      </Text>
    </G>
  );
};

export default function XAxis({ xScale, margin }) {
  return (
    <G x={margin.left} y={margin.top}>
      {getTicks(xScale).map((d, i) => (
        <Tick key={i} data={d} margin={margin} />
      ))}
    </G>
  );
}
