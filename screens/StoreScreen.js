import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const StoreScreen = ({ navigation }) => {
  const [storeDetails, setStoreDetails] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBaseUrl = () => {
    return "http://13.125.82.79:8080";
  };

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    return { hour, minute };
  };

  const fetchStoreDetails = async () => {
    try {
      const sessionId = await AsyncStorage.getItem("sessionId");
      const response = await fetch(`${getBaseUrl()}/store/my`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `JSESSIONID=${sessionId}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const openTime = formatTime(data.openTime);
        const closeTime = formatTime(data.closeTime);
        setStoreDetails({
          ...data,
          openTime: openTime.hour + ":" + openTime.minute,
          closeTime: closeTime.hour + ":" + closeTime.minute,
          openHour: openTime.hour,
          openMinute: openTime.minute,
          closeHour: closeTime.hour,
          closeMinute: closeTime.minute,
        });
        await fetchNotices(data.id);
      } else {
        navigation.navigate("CreateStore");
        return; // 추가: CreateStore로 이동 후 더 이상의 처리가 필요 없으므로 return
      }
    } catch (error) {
      console.error("Error fetching store details:", error);
      Alert.alert("Error", "Failed to fetch store details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotices = async (storeId) => {
    try {
      const sessionId = await AsyncStorage.getItem("sessionId");
      const response = await fetch(`${getBaseUrl()}/notice/${storeId}?page=0`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `JSESSIONID=${sessionId}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotices(data.value);
      } else {
        Alert.alert("Error", "Failed to fetch notices.");
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
      Alert.alert("Error", "Failed to fetch notices.");
    }
  };

  const deleteNotice = async (noticeId) => {
    try {
      const sessionId = await AsyncStorage.getItem("sessionId");
      const response = await fetch(
        `${getBaseUrl()}/notice/delete/${noticeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `JSESSIONID=${sessionId}`,
          },
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Notice deleted successfully.");
        fetchNotices(storeDetails.id); // Refresh notices after deletion
      } else {
        Alert.alert("Error", "Failed to delete notice.");
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
      Alert.alert("Error", "Failed to delete notice.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStoreDetails();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!storeDetails) {
    return null; // storeDetails가 null일 때 화면 렌더링 중지
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerButtons}>
        <Button
          title="공지작성"
          onPress={() =>
            navigation.navigate("CreateNotice", { storeId: storeDetails.id })
          }
        />
        <Button
          title="가게 정보 수정"
          onPress={() =>
            navigation.navigate("UpdateStore", {
              storeId: storeDetails.id,
              storeName: storeDetails.storeName,
              openHour: storeDetails.openHour,
              openMinute: storeDetails.openMinute,
              closeHour: storeDetails.closeHour,
              closeMinute: storeDetails.closeMinute,
            })
          }
        />
      </View>
      <Text style={styles.storeName}>{storeDetails.storeName}</Text>
      <Text>Open: {storeDetails.openTime}</Text>
      <Text>Close: {storeDetails.closeTime}</Text>
      <FlatList
        data={notices}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.noticeItem}>
            <View style={styles.noticeHeader}>
              <TouchableOpacity
                onPress={() => deleteNotice(item.id)}
                style={styles.iconButton}
              >
                <Icon name="close" size={20} color="red" />
              </TouchableOpacity>
            </View>
            <Text style={styles.noticeTitle}>{item.title}</Text>
            <Text style={styles.noticeBody}>{item.body}</Text>
            <Text style={styles.noticeDate}>
              작성일: {new Date(item.createTime).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  storeName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noticeItem: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  noticeHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  iconButton: {
    marginLeft: 15,
  },
  noticeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noticeBody: {
    fontSize: 16,
  },
  noticeDate: {
    fontSize: 12,
    color: "gray",
    marginTop: 10,
    textAlign: "right",
  },
});

export default StoreScreen;
