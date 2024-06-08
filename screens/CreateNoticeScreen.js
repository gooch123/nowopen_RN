import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateNoticeScreen = ({ navigation, route }) => {
  const { storeId } = route.params;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const getBaseUrl = () => {
    return "http://10.0.2.2:8080";
  };

  const createNotice = async () => {
    try {
      const sessionId = await AsyncStorage.getItem("sessionId");
      const response = await fetch(`${getBaseUrl()}/notice/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `JSESSIONID=${sessionId}`,
        },
        body: JSON.stringify({
          title,
          body,
          storeId,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Notice created successfully.", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Store", { refresh: true }),
          },
        ]);
      } else {
        Alert.alert("Error", "Failed to create notice.");
      }
    } catch (error) {
      console.error("Error creating notice:", error);
      Alert.alert("Error", "Failed to create notice.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Body"
        value={body}
        onChangeText={setBody}
      />
      <Button title="Create Notice" onPress={createNotice} />
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
});

export default CreateNoticeScreen;
