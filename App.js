import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import StoreScreen from "./screens/StoreScreen";
import StoreDetailsScreen from "./screens/StoreDetailsScreen";
import SignUpScreen from "./screens/SignUpScreen";
import CreateStoreScreen from "./screens/CreateStoreScreen";
import CreateNoticeScreen from "./screens/CreateNoticeScreen";
import UpdateStoreScreen from "./screens/UpdateStoreScreen";
import BookmarkScreen from "./screens/BookmarkScreen"; // 추가

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Store" component={StoreScreen} />
        <Stack.Screen name="StoreDetails" component={StoreDetailsScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="CreateStore" component={CreateStoreScreen} />
        <Stack.Screen name="CreateNotice" component={CreateNoticeScreen} />
        <Stack.Screen name="UpdateStore" component={UpdateStoreScreen} />
        <Stack.Screen name="Bookmark" component={BookmarkScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
