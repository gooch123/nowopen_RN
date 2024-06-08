import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const CreateStoreScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [openHour, setOpenHour] = useState("00");
  const [openMinute, setOpenMinute] = useState("00");
  const [closeHour, setCloseHour] = useState("00");
  const [closeMinute, setCloseMinute] = useState("00");

  const getBaseUrl = () => {
    return "http://10.0.2.2:8080";
  };

  const padTime = (time) => {
    return time.toString().padStart(2, "0");
  };

  const createStore = async () => {
    try {
      const sessionId = await AsyncStorage.getItem("sessionId");
      const response = await fetch(`${getBaseUrl()}/store/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `JSESSIONID=${sessionId}`,
        },
        body: JSON.stringify({
          name,
          openTime: `${padTime(openHour)}:${padTime(openMinute)}`,
          closeTime: `${padTime(closeHour)}:${padTime(closeMinute)}`,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Store created successfully.", [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("Store", { refresh: true });
            },
          },
        ]);
      } else {
        Alert.alert("Error", "Failed to create store.");
      }
    } catch (error) {
      console.error("Error creating store:", error);
      Alert.alert("Error", "Failed to create store.");
    }
  };

  const renderPickerItems = (start, end) => {
    let items = [];
    for (let i = start; i <= end; i++) {
      items.push(
        <Picker.Item key={i} label={`${padTime(i)}`} value={`${padTime(i)}`} />
      );
    }
    return items;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Store Name"
        value={name}
        onChangeText={setName}
      />
      <Text>Open Time</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={openHour}
          style={styles.picker}
          onValueChange={(itemValue) => setOpenHour(itemValue)}
        >
          {renderPickerItems(0, 23)}
        </Picker>
        <Picker
          selectedValue={openMinute}
          style={styles.picker}
          onValueChange={(itemValue) => setOpenMinute(itemValue)}
        >
          {renderPickerItems(0, 59)}
        </Picker>
      </View>
      <Text>Close Time</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={closeHour}
          style={styles.picker}
          onValueChange={(itemValue) => setCloseHour(itemValue)}
        >
          {renderPickerItems(0, 23)}
        </Picker>
        <Picker
          selectedValue={closeMinute}
          style={styles.picker}
          onValueChange={(itemValue) => setCloseMinute(itemValue)}
        >
          {renderPickerItems(0, 59)}
        </Picker>
      </View>
      <Button title="Create Store" onPress={createStore} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  picker: {
    flex: 1,
  },
});

export default CreateStoreScreen;
