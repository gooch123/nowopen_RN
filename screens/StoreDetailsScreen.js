// screens/StoreDetailsScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const StoreDetailsScreen = ({ route }) => {
  const { id } = route.params;
  const [storeDetails, setStoreDetails] = useState(null);
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);

  const getBaseUrl = () => {
    return "http://10.0.2.2:8080";
  };

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    return `${hour}:${minute}`;
  };

  const fetchStoreDetails = async () => {
    try {
      const response = await fetch(`${getBaseUrl()}/store/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Store Details:", data); // Store details 데이터를 콘솔에 출력

      // Extract the hour and minute from openTime and closeTime
      const openTime = formatTime(data.openTime);
      const closeTime = formatTime(data.closeTime);

      setStoreDetails({
        ...data,
        openTime,
        closeTime,
      });
    } catch (error) {
      console.error("Error fetching store details:", error);
    }
  };

  const fetchNotices = async (pageNum = 0) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${getBaseUrl()}/notice/${id}?page=${pageNum}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("Notices:", data); // Notices 데이터를 콘솔에 출력
      if (pageNum === 0) {
        setNotices(data.value);
      } else {
        setNotices((prevNotices) => [...prevNotices, ...data.value]);
      }
      setHasNext(data.hasNext);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreDetails();
    fetchNotices(0);
  }, []);

  const handleLoadMore = () => {
    if (hasNext) {
      fetchNotices(page + 1);
    }
  };

  return storeDetails ? (
    <View style={styles.container}>
      <View style={styles.storeDetails}>
        <Text style={styles.storeName}>{storeDetails.storeName}</Text>
        <Text style={styles.storeTime}>Open: {storeDetails.openTime}</Text>
        <Text style={styles.storeTime}>Close: {storeDetails.closeTime}</Text>
      </View>
      <FlatList
        data={notices}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.noticeItem}>
            <Text style={styles.noticeTitle}>{item.title}</Text>
            <Text style={styles.noticeBody}>{item.body}</Text>
            <Text style={styles.noticeDate}>
              작성일: {new Date(item.createTime).toLocaleString()}
            </Text>
          </View>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} // 스크롤이 50% 지점에 도달하면 handleLoadMore 실행
        ListFooterComponent={
          loading && <ActivityIndicator size="large" color="#0000ff" />
        }
      />
    </View>
  ) : (
    <ActivityIndicator size="large" color="#0000ff" />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  storeDetails: {
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
  storeName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  storeTime: {
    fontSize: 16,
    color: "#666",
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
  noticeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noticeBody: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  noticeDate: {
    fontSize: 14,
    color: "#888",
  },
});

export default StoreDetailsScreen;
