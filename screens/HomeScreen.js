import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Application from "expo-application";

const HomeScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    const fetchDeviceId = async () => {
      const id =
        Platform.OS === "android"
          ? await Application.getAndroidId()
          : Constants.deviceId;
      setDeviceId(id);
      console.log("device id : ", id);
    };

    fetchDeviceId();
  }, []);

  const getBaseUrl = () => {
    return "http://10.0.2.2:8080";
  };

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    return `${hour}:${minute}`;
  };

  const fetchData = async (pageNum = 0) => {
    if (loading || !deviceId) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${getBaseUrl()}/search?storeName=${query}&page=${pageNum}&deviceId=${deviceId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("Search Results:", data);

      const formattedData = data.value.map((item) => ({
        ...item,
        openTime: formatTime(item.openTime),
        closeTime: formatTime(item.closeTime),
      }));

      if (pageNum === 0) {
        setResults(formattedData);
      } else {
        setResults((prevResults) => [...prevResults, ...formattedData]);
      }
      setHasNext(data.hasNext);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasNext) {
      fetchData(page + 1);
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

  const handleBookmark = async (storeId, isBookmarked) => {
    if (!deviceId) return; // deviceId가 설정되지 않은 경우 리턴

    try {
      const url = isBookmarked
        ? `${getBaseUrl()}/bookmark/${storeId}/delete/${deviceId}`
        : `${getBaseUrl()}/bookmark/save`;

      const method = "POST";
      const body = isBookmarked ? null : JSON.stringify({ deviceId, storeId });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (response.ok) {
        fetchData(0);
      } else {
        console.error("Error handling bookmark");
      }
    } catch (error) {
      console.error("Error handling bookmark:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={() => navigation.navigate("Bookmark")}
        >
          <FontAwesome name="star" size={24} color="black" />
          <Text style={styles.buttonText}>즐겨찾기</Text>
        </TouchableOpacity>
        <Button title="Login" onPress={() => navigation.navigate("Login")} />
        <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} />
      </View>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={query}
          onChangeText={setQuery}
        />
        <Button title="Search" onPress={() => fetchData(0)} />
      </View>
      <FlatList
        data={results}
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
              <View style={styles.resultHeader}>
                <Text style={styles.storeName}>{item.storeName}</Text>
                <TouchableOpacity
                  onPress={() => handleBookmark(item.id, item.isBookmarked)}
                >
                  <FontAwesome
                    name="star"
                    size={24}
                    color={item.isBookmarked ? "gold" : "darkgray"}
                  />
                </TouchableOpacity>
              </View>
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
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <Text>Loading more...</Text>}
      />
      {hasNext && <Text style={styles.footer}>More results available...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  bookmarkButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
    padding: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  footer: {
    padding: 10,
    textAlign: "center",
    color: "grey",
  },
});

export default HomeScreen;
