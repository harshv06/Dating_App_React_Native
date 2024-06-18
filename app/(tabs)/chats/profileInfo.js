import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Image } from "react-native-expo-image-cache";
import { useLocalSearchParams } from "expo-router";

const ProfileInfo = () => {
  const email = "vishwakarmaharsh45@gmail.com";
  const { id } = useLocalSearchParams();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    if (id) {
      const parseId = id
      const fetchDetails = async () => {
        try {
          const response = await fetch(
            "http://192.168.0.105:3000/fetchLikedProfilesInfo",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: [parseId] }),
            }
          );

          const result = await response.json();
          if (result.profile) {
            const updatedProfiles = result.profile.map((profile) => ({
              ...profile,
              profileImages: profile.profileImages.map((path) =>
                path.replace(/\\/g, "/")
              ),
            }));
            setProfiles(updatedProfiles);
          }
        } catch (err) {
          console.log("Error:", err);
        }
      };
      fetchDetails();
    }
  }, [id]);

  const handleLike = async () => {
    try {
      const response = await fetch("http://192.168.0.105:3000/createMatch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: [id] }),
      });
      const result = await response.json();
      console.log(result);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const renderBoxes = () => {
    return profiles.map((profile, index) => (
      <View key={index} style={styles.boxContainer}>
        {profile.interests.map((text, idx) => (
          <View key={idx} style={styles.box}>
            <Text>{text}</Text>
          </View>
        ))}
      </View>
    ));
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Animated.View style={{ flex: 1 }}>
        <View>
          {profiles.length > 0 && profiles[0].profileImages.length > 0 ? (
            <Image
              uri={`http://192.168.0.105:3000/${profiles[0].profileImages[0]}`}
              style={styles.image}
              resizeMode="cover"
              placeholderContent={<Text>Loading...</Text>}
            />
          ) : (
            <Text>No Image Available</Text>
          )}

          <View style={styles.iconsContainer}>
            <Pressable style={styles.circle}>
              <AntDesign
                name="close"
                size={24}
                color="red"
                style={styles.icons}
              />
            </Pressable>
            <Pressable
              style={[styles.circle, { width: 70, height: 70 }]}
              onPress={handleLike}
            >
              <AntDesign
                name="heart"
                size={26}
                color="#E03368"
                style={styles.icons}
              />
            </Pressable>
            <Pressable style={styles.circle}>
              <AntDesign
                name="star"
                size={24}
                color="#FF84A7"
                style={styles.icons}
              />
            </Pressable>
          </View>
        </View>

        <View style={{ marginTop: 50, marginLeft: 20 }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: "400" }}>
              Harsh Vishwakarma
            </Text>
            <Text style={{ fontSize: 16, color: "gray", fontWeight: "300" }}>
              Tagline
            </Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "400" }}>About</Text>
            <Text style={{ fontSize: 14, color: "gray", fontWeight: "300" }}>
              Random Text
            </Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "400" }}>Interests</Text>
            {renderBoxes()}
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "400" }}>Gallery</Text>
            <Text style={{ marginTop: 10, color: "gray" }}>
              Nothing to show here
            </Text>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

export default ProfileInfo;

const styles = StyleSheet.create({
  image: {
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "gray",
    width: "100%",
    height: Platform.OS === "ios" ? 350 : 350,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  circle: {
    backgroundColor: "white",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  iconsContainer: {
    position: "absolute",
    bottom: -30,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    alignItems: "center",
    zIndex: 1,
  },
  icons: {
    padding: 10,
  },
  boxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  box: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginTop: 10,
    marginRight: 10,
    borderWidth: 0.3,
  },
});
