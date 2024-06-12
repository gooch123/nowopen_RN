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

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const response = await fetch("http://13.125.82.79:8080/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        Alert.alert("회원가입 성공", "회원가입이 성공적으로 완료되었습니다.", [
          { text: "OK", onPress: () => navigation.navigate("Home") },
        ]);
      } else if (response.status === 400) {
        Alert.alert("회원가입 실패", "아이디가 중복되었습니다.");
      } else {
        Alert.alert("회원가입 실패", "알 수 없는 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      Alert.alert("회원가입 실패", "알 수 없는 오류가 발생했습니다.");
    }

    console.log("username : ", username);
    console.log("password", password);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} />
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

export default SignUpScreen;
