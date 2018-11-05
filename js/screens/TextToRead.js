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
  KeyboardAvodingView,
  FlatList,
  Modal
} from "react-native";

import {
  Cell,
  CustomCell,
  Section,
  TableView
} from "react-native-tableview-simple";

import FocusPoint from "../components/FocusPoint";

export default class TextToRead extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Texts",
    headerRight: (
      <Button
        title={"Add"}
        onPress={() => navigation.setParams({ modalVisible: true })}
      />
    )
  });
  state = {
    modalVisible: false,
    draft: "",
    draftId: null
  };
  addText() {
    this.setState({ modalVisible: true });
  }
  static getDerivedStateFromProps(props, state) {
    if (props.navigation.getParam("modalVisible")) {
      return {
        ...state,
        modalVisible: props.navigation.getParam("modalVisible")
      };
    }
    return state;
  }
  cancel() {
    this.props.navigation.setParams({ modalVisible: false });
    this.setState({ modalVisible: false, draft: "", draftId: null });
  }
  save() {
    this.props.navigation.setParams({ modalVisible: false });
    this.setState({ modalVisible: false });
    const { settings, updateSettings } = this.props.screenProps;
    const texts = settings.texts || [];
    if (this.state.draftId != null) {
      texts[this.state.draftId] = this.state.draft;
      updateSettings({ texts, textToRead: this.state.draftId });
    } else {
      updateSettings({
        texts: texts.concat([this.state.draft]),
        textToRead: texts.size
      });
    }
  }
  edit(index, text) {
    this.setState({
      draftId: index,
      draft: text,
      modalVisible: true
    });
  }
  render() {
    const { settings, updateSettings } = this.props.screenProps;
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardDismissMode="on-drag"
      >
        <FlatList
          style={{ width: "100%" }}
          data={settings.texts}
          keyExtractor={key => key}
          renderItem={({ item, index }) => (
            <Item
              key={index}
              text={item}
              selected={index == settings.textToRead}
              select={() => this.edit(index, item)}
            />
          )}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                marginTop: 200,
                alignItems: "center",
                justifyContent: "center",
                padding: 20
              }}
            >
              <Text style={{ fontSize: 18 }}>
                No texts available for reading.{" "}
                <Text onPress={() => this.addText()} style={{ color: "blue" }}>
                  Add text
                </Text>
              </Text>
            </View>
          }
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
        >
          <View style={styles.container}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 20,
                paddingHorizontal: 10,
                width: "100%"
              }}
            >
              <Button title="Cancel" onPress={() => this.cancel()} />

              <Button title="Save & Make active" onPress={() => this.save()} />
            </View>

            <View style={styles.preview}>
              <FocusPoint content={this.state.draft} text={true} />
            </View>
            <View style={{ marginBottom: 20 }}>
              <TextInput
                autoCorrect={false}
                autoFocus={true}
                onChangeText={draft => draft && this.setState({ draft })}
                defaultValue={this.state.draft || ""}
                multiline={true}
                style={styles.textInput}
                placeholder="Start typing text here"
              />
            </View>
            {/* <Button
              title="Clear"
              onPress={() => updateSettings({ textToRead: "" })}
            /> */}
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

function Item({ text, selected, select }) {
  return (
    <TouchableOpacity
      style={{
        height: 40,
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-between",
        paddingHorizontal: 30,
        width: "100%",
        marginBottom: 0.5,
        flexDirection: "row",
        alignItems: "center"
      }}
      onPress={() => select()}
    >
      <Text numberOfLines={1}>{text}</Text>
      {selected && <Text>✔️</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10
  },
  preview: {
    margin: 30,
    height: 100,
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 0.5,
    borderRadius: 5
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
