/* @flow */
import { NativeModules, NativeEventEmitter } from "react-native";

const { FaceTrackerModule } = NativeModules;

const faceTrackerEmitter = new NativeEventEmitter(FaceTrackerModule);

export default function startTracking(callback: Function) {
  FaceTrackerModule.startTracking();
  return faceTrackerEmitter.addListener("onDistanceChange", callback);
}
