import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";
import * as Application from "expo-application";

const BookmarkScreen = ({ navigation }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    const fetchDeviceId = async () => {
      const id =
        Platform.OS === "android"
          ? Application.getAndroidId()
          : Constants.deviceId;
      setDeviceId(id);
      fetchBookmarks(id, 0); // Initial fetch with page 0
    };

    fetchDeviceId();
  }, []);

  const getBaseUrl = () => {
    return "http://13.125.82.79:8080";
  };

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    return `${hour}:${minute}`;
  };

  const fetchBookmarks = async (deviceId, page) => {
    if (!deviceId) return; // deviceId가 설정되지 않은 경우 리턴
    setLoading(true);
    try {
      const response = await fetch(
        `${getBaseUrl()}/bookmark?deviceId=${deviceId}&page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Bookmarks:", data);

        // Extract the hour and minute from openTime and closeTime
        const formattedData = data.value.map((item) => ({
          ...item,
          openTime: formatTime(item.openTime),
          closeTime: formatTime(item.closeTime),
        }));

        if (page === 0) {
          setBookmarks(formattedData);
        } else {
          setBookmarks((prevBookmarks) => [...prevBookmarks, ...formattedData]);
        }
        setHasNext(data.hasNext);
        setLoading(false);
      } else {
        console.log("Failed to fetch bookmarks.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasNext) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchBookmarks(deviceId, nextPage);
    }
  };

  const isOpenNow = (openTime, closeTime) => {
    const now = new Date();
    const [openHour, openMinute] = openTime.split(":").map(Number);
    const [closeHour, closeMinute] = closeTime.split(":").map(Number);

    const openDate = new Date();
    openDate.setHours(openHour, openMinute, 0, 0);

    const closeDate = new Date();
    closeDate.setHours(closeHour, closeMinute, 0, 0);

    return now >= openDate && now <= closeDate;
  };

  useFocusEffect(
    useCallback(() => {
      if (deviceId) {
        fetchBookmarks(deviceId, 0);
      }
    }, [deviceId])
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isOpen = isOpenNow(item.openTime, item.closeTime);
            return (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() =>
                  navigation.navigate("StoreDetails", { id: item.id })
                }
              >
                <Text style={styles.storeName}>{item.storeName}</Text>
                <Text>Open: {item.openTime}</Text>
                <Text>Close: {item.closeTime}</Text>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: isOpen ? "green" : "red" },
                    ]}
                  />
                  <Text style={styles.statusText}>
                    {isOpen ? "영업중" : "개점 시간 아님"}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading && <Text>Loading more...</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  storeName: {
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
  },
});

export default BookmarkScreen;
