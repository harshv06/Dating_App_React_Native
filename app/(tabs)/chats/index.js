import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { useFocusEffect } from "@react-navigation/native";

const Index = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [tab, setTab] = useState(false);
  const email = "harshvonmail@gmail.com";
  const [pendingLikes, setPendingLikes] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (pendingLikes.length > 0) {
      console.log("Pending Likes: ", pendingLikes);
      fetchLikedProfileInfo(pendingLikes);
    }
  }, [pendingLikes]);

  const fetchLikedProfileInfo = async () => {
    if (pendingLikes) {
      const response = await fetch(
        "http://192.168.0.105:3000/fetchLikedProfilesInfo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: pendingLikes }),
        }
      );
      const result = await response.json();
      if (result.profile) {
        const updatedProfiles = result.profile.map((img) => ({
          ...img,
          profileImages: img.profileImages.map((path) =>
            path.replace(/\\/g, "/")
          ),
        }));
        setProfiles(updatedProfiles);
        console.log(updatedProfiles);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchLikes = async () => {
        try {
          const response = await fetch("http://192.168.0.105:3000/fetchLikes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email }),
          });
          const result = await response.json();
          if (result.pendingLikes.length==0) {
            console.log("No profiles to show");
            setProfiles(null)
          } else {
            setPendingLikes(result.pendingLikes);
            console.log(result.pendingLikes.length);
          }
        } catch (err) {
          console.log(err);
        }
      };

      fetchLikes();
      console.log("Done");
    }, [])
  );

  const renderCards = () => {
    if (profiles.length > 0) {
      return profiles.map((profile, index) => (
        <Pressable
          key={index}
          style={styles.card}
          onPress={() => {
            console.log(profile._id);
            router.push(
              `/(tabs)/chats/profileInfo/?id=${encodeURIComponent(profile._id)}`
            );
          }}
        >
          <Image
            uri={`http://192.168.0.105:3000/${profile.profileImages[0]}`}
            style={styles.image}
            resizeMode="contain"
            placeholderContent={
              <ActivityIndicator size="small" color="#0000ff" />
            }
          />
          <View style={styles.pressable}>
            <Text style={styles.cardText}>{profile.name}</Text>
            <Text style={styles.cardText2}>Message</Text>
          </View>
        </Pressable>
      ));
    } else {
      return <Text>No profiles found</Text>;
    }
  };
  

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.tabContainer}>
          <Pressable style={styles.tabButton} onPress={() => setTab(true)}>
            <Animated.View style={{ opacity: fadeAnim }}>
              <Text
                style={[styles.btnText, { color: tab ? "#FF84A7" : "black" }]}
              >
                Messages
              </Text>
            </Animated.View>
          </Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.tabButton} onPress={() => setTab(false)}>
            <Animated.View style={{ opacity: fadeAnim }}>
              <Text
                style={[styles.btnText, { color: tab ? "black" : "#FF84A7" }]}
              >
                Matches
              </Text>
            </Animated.View>
          </Pressable>
        </View>

        {tab ? (
          <View>
            <Text>ho</Text>
          </View>
        ) : (
          <>
            {profiles ? (
              <View style={{ marginTop: 0 }}>{renderCards()}</View>
            ) : (
              <Text>nothing</Text>
            )}
          </>
        )}
      </ScrollView>
    </Animated.View>
  );
};

export default Index;

const styles = StyleSheet.create({
  btnText: {
    fontSize: 20,
    fontWeight: "500",
    padding: 20,
    shadowColor: "#000",
    shadowRadius: 1,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 0.3,
    borderBottomColor: "gray",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  tabButton: {
    alignItems: "center",
  },
  separator: {
    backgroundColor: "gray",
    width: 1.5,
    height: 40,
  },
  card: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    height: 100,
    marginHorizontal: 15,
  },
  cardText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "500",
  },
  cardText2: {
    fontSize: 15,
    marginTop: 10,
    color: "#333",
    fontWeight: "300",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 80,
    backgroundColor: "lightgray",
  },
  pressable: {
    borderBottomColor: "black",
    borderBottomWidth: 0.5,
    width: "100%",
    padding: 20,
  },
});
