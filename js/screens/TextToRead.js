import React from "react";
import {
  Button,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  Switch,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvodingView
} from "react-native";

import {
  Cell,
  CustomCell,
  Section,
  TableView
} from "react-native-tableview-simple";

import FocusPoint from "../components/FocusPoint";

export default class TextToRead extends React.Component {
  static navigationOptions = {
    title: "Text to Read"
  };
  render() {
    const { settings, updateSettings } = this.props.screenProps;
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.preview}>
          <FocusPoint content={settings.textToRead || ""} text={true} />
        </View>
        <View style={{ marginBottom: 20 }}>
          <TextInput
            autoCorrect={false}
            autoFocus={true}
            onChangeText={text => text && updateSettings({ textToRead: text })}
            defaultValue={settings.textToRead || ""}
            multiline={true}
            style={styles.textInput}
          />
        </View>
        <Button
          title="Clear"
          onPress={() => updateSettings({ textToRead: "" })}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  preview: {
    margin: 30,
    height: 100,
    alignItems: "center"
  },
  textInput: {
    width: 320,
    height: 300,
    fontSize: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 5
  },
  container: {
    flex: 1,
    alignItems: "center"
  },
  subheader: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 19,
    fontWeight: "bold"
  },
  section: {
    flexDirection: "row",
    paddingHorizontal: 20,
    flex: 1,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    margin: 5,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black"
  },
  buttonText: {
    fontSize: 30
  }
});
