/* @float */
import React from "react";
import { View, Dimensions } from "react-native";

import moment from "moment";

import * as d3Shape from "d3-shape";
import { scaleTime, scaleLinear } from "d3-scale";
import { Svg, Path } from "react-native-svg";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = 300;

const margin = {
  top: 0,
  bottom: 0,
  left: 15,
  right: 5
};

function findMin(data) {
  const times = data.map(d => moment(d.startedAt).valueOf());
  return Math.min(...times);
  // return moment().subtract(7, 'd');
}

function prepareDistanceProgressLine(data) {
  const minTime = findMin(data)
  const x = scaleTime()
    .domain([moment(minTime).toDate(), new Date()])
    .range([0, WIDTH]);

  const y = scaleLinear().domain([0, 500]).range([0, 300]);

  return d3Shape
    .line()
    .defined(point => point && point.startedAt && point.endDistance)
    .x(d => x(moment(d.startedAt).toDate()))
    .y(d => y(d.endDistance));
}

function prepareDurationProgressLine(data) {
  const minTime = findMin(data)
  const durations = data.map(d => moment(d.endedAt).diff(moment(d.startedAt), "seconds"));
  const maxDuration = Math.max(...durations, 15*60);
  const x = scaleTime()
    .domain([moment(minTime).toDate(), new Date()])
    .range([0, WIDTH]);

  const y = scaleLinear().domain([0, 500]).range([0, maxDuration]);

  return d3Shape
    .line()
    .defined(point => point && point.startedAt && point.endDistance)
    .x(d => x(moment(d.startedAt).toDate()))
    .y(d => y(d.endDistance));
}

export default class MainScreen extends React.Component {
  render() {
    const { data } = this.props;

    if (!data || data.length === 0) {
      return null;
    }

    const distanceShape = prepareDistanceProgressLine(data);
    const timeShape = prepareDurationProgressLine(data);
    return (
      <Svg width={WIDTH} height={HEIGHT}>
        <Path
          key={1}
          x={margin.left}
          y={margin.top}
          fill="none"
          stroke={"skyblue"}
          strokeLinecap="round"
          strokeWidth={3}
          d={distanceShape(data)}
        />
        <Path
          key={2}
          x={margin.left}
          y={margin.top}
          fill="none"
          stroke={"salmon"}
          strokeLinecap="round"
          strokeWidth={3}
          d={timeShape(data)}
        />
      </Svg>
    );
  }
}
