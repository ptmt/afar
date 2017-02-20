/* @float */
import React from "react";
import { View, Dimensions } from "react-native";

import moment from "moment";

import * as d3Shape from "d3-shape";
import { scaleTime, scaleLinear } from "d3-scale";
import { Svg, Path, G, Text, Line } from "react-native-svg";

import XAxis from "./XAxis";
import YAxis from "./YAxis";
// import YAsis from './YAsis'

const WIDTH = Dimensions.get("window").width;
const HEIGHT = 300;

const margin = {
  top: 10,
  bottom: 10,
  left: 20,
  right: 5
};

function groupByDay(data) {
  const duration = d => moment(d.endedAt).diff(moment(d.startedAt), "seconds");
  return Object.values(
    data.reduce(
      (byDay, t) => {
        const key = moment(t.startedAt).format("YYYY_MMM_dd");
        if (!byDay[key]) {
          byDay[key] = { duration: 0 };
        }
        byDay[key].duration += duration(t);
        byDay[key].lastTraining = t.startedAt;
        byDay[key].endDistance = t.endDistance > byDay[key].endDistance
          ? byDay[key].endDistance
          : t.endDistance;
        return byDay;
      },
      {}
    )
  );
}

function findMin(data) {
  const times = data.map(d => moment(d.lastTraining).valueOf());
  return Math.min(...times);
}

function getScaleX(data) {
  const minTime = findMin(data);
  return scaleTime()
    .domain([moment(minTime).toDate(), moment().add(1, "day").toDate()])
    .range([0, WIDTH - margin.left - margin.right]);
}

function getScaleY1(data) {
  return scaleLinear()
    .domain([0, 500])
    .range([HEIGHT - margin.top - margin.bottom - 20, 0]);
}

function getScaleY2(data) {
  const durations = data.map(d => d.duration);
  const maxDuration = Math.max(...durations);
  return scaleLinear()
    .domain([0, maxDuration])
    .range([HEIGHT - margin.top - margin.bottom - 20, 0]);
}

function prepareDistanceProgressLine(x, y) {
  return d3Shape
    .line()
    .defined(point => point && point.lastTraining && point.endDistance)
    .x(d => x(moment(d.lastTraining).toDate()))
    .y(d => y(d.endDistance));
}

function prepareDurationProgressLine(x, y) {
  return d3Shape
    .line()
    .defined(point => point && point.lastTraining && point.duration)
    .x(d => x(moment(d.lastTraining).toDate()))
    .y(d => y(d.duration));
}

export default class MainScreen extends React.Component {
  render() {
    const { data } = this.props;

    if (!data || data.length === 0) {
      return null;
    }
    const grouped = groupByDay(data);

    const xScale = getScaleX(grouped);
    const y1Scale = getScaleY1(grouped);
    const y2Scale = getScaleY2(grouped);
    const distanceShape = prepareDistanceProgressLine(xScale, y1Scale);
    const durationShape = prepareDurationProgressLine(xScale, y2Scale);
    return (
      <View style={{ backgroundColor: "white" }}>
        <Svg width={WIDTH} height={HEIGHT}>
          <Path
            key={1}
            x={margin.left}
            y={margin.top}
            fill="none"
            stroke={"skyblue"}
            strokeLinecap="round"
            strokeWidth={3}
            d={distanceShape(grouped)}
          />
          <Path
            key={2}
            x={margin.left}
            y={margin.top}
            fill="none"
            stroke={"salmon"}
            strokeLinecap="round"
            strokeWidth={3}
            d={durationShape(grouped)}
          />
          <XAxis
            xScale={xScale}
            margin={margin}
          />
          <YAxis
            label={'px'}
            yScale={y1Scale}
            color={"skyblue"}
            margin={margin}
            offset={WIDTH - 40}
          />
          <YAxis
            label={'minutes'}
            labelFunc={(t) => Math.round(t / 60)}
            yScale={y2Scale}
            color={"salmon"}
            margin={margin}
            offset={15}
          />
        </Svg>
      </View>
    );
  }
}
