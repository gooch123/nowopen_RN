import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import StoreDetailsScreen from "./screens/StoreDetailsScreen";
import BookmarkScreen from "./screens/BookmarkScreen";
import CreateStoreScreen from "./screens/CreateStoreScreen";
import UpdateStoreScreen from "./screens/UpdateStoreScreen";
import CreateNoticeScreen from "./screens/CreateNoticeScreen";
import StoreScreen from "./screens/StoreScreen";
import * as SplashScreen from "expo-splash-screen";

const Stack = createStackNavigator();

const SplashScreenComponent = ({ navigation }) => {
  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();
      setTimeout(async () => {
        await SplashScreen.hideAsync();
        navigation.replace("Home");
      }, 2000);
    };

    prepare();
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Image
        source={require("./assets/nowopen_logo.png")}
        style={styles.logo}
      />
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreenComponent}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="StoreDetails" component={StoreDetailsScreen} />
        <Stack.Screen name="Bookmark" component={BookmarkScreen} />
        <Stack.Screen name="CreateStore" component={CreateStoreScreen} />
        <Stack.Screen name="UpdateStore" component={UpdateStoreScreen} />
        <Stack.Screen name="CreateNotice" component={CreateNoticeScreen} />
        <Stack.Screen name="Store" component={StoreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});

export default App;
