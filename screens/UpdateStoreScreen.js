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

const UpdateStoreScreen = ({ navigation, route }) => {
  const { storeId, storeName, openHour, openMinute, closeHour, closeMinute } =
    route.params;
  const [name, setName] = useState(storeName);
  const [openHourState, setOpenHour] = useState(openHour);
  const [openMinuteState, setOpenMinute] = useState(openMinute);
  const [closeHourState, setCloseHour] = useState(closeHour);
  const [closeMinuteState, setCloseMinute] = useState(closeMinute);

  const getBaseUrl = () => {
    return "http://13.125.82.79:8080";
  };

  const padTime = (time) => {
    return time.toString().padStart(2, "0");
  };

  const updateStore = async () => {
    try {
      const sessionId = await AsyncStorage.getItem("sessionId");
      const response = await fetch(`${getBaseUrl()}/store/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `JSESSIONID=${sessionId}`,
        },
        body: JSON.stringify({
          id: storeId,
          name,
          openTime: `${padTime(openHourState)}:${padTime(openMinuteState)}`,
          closeTime: `${padTime(closeHourState)}:${padTime(closeMinuteState)}`,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Store updated successfully.", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Store", { refresh: true }),
          },
        ]);
      } else {
        Alert.alert("Error", "Failed to update store.");
      }
    } catch (error) {
      console.error("Error updating store:", error);
      Alert.alert("Error", "Failed to update store.");
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
          selectedValue={openHourState}
          style={styles.picker}
          onValueChange={(itemValue) => setOpenHour(itemValue)}
        >
          {renderPickerItems(0, 23)}
        </Picker>
        <Picker
          selectedValue={openMinuteState}
          style={styles.picker}
          onValueChange={(itemValue) => setOpenMinute(itemValue)}
        >
          {renderPickerItems(0, 59)}
        </Picker>
      </View>
      <Text>Close Time</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={closeHourState}
          style={styles.picker}
          onValueChange={(itemValue) => setCloseHour(itemValue)}
        >
          {renderPickerItems(0, 23)}
        </Picker>
        <Picker
          selectedValue={closeMinuteState}
          style={styles.picker}
          onValueChange={(itemValue) => setCloseMinute(itemValue)}
        >
          {renderPickerItems(0, 59)}
        </Picker>
      </View>
      <Button title="Update Store" onPress={updateStore} />
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

export default UpdateStoreScreen;
