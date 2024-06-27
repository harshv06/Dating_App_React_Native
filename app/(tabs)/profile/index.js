import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  PanResponder,
  Animated,
  Dimensions,
  Pressable,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

const { width, height } = Dimensions.get("window");
const SWIPE_THRESHOLD = 120; // Adjust swipe distance threshold as needed

const Index = () => {
  const registerForPushNotificationsAsync = async (email) => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;

      // Save token to backend
      await fetch("http://your-server.com/saveFcmToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, fcmToken: token }),
      });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };

  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pan] = useState(new Animated.ValueXY());
  const [swipeLeftOpacity] = useState(new Animated.Value(0));
  const [swipeRightOpacity] = useState(new Animated.Value(0));
  const email = "harshvonmail@gmail.com"; // Replace with actual email or fetch dynamically

  const handleLikeBackend = async (id) => {
    const response = await fetch("http://192.168.0.105:3000/handleLike", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, email: email }),
    });

    const result = await response.json();

    if (result.message) {
      console.log("done");
    }
  };

  const handledislikeBackend = async (id) => {
    const response = await fetch("http://192.168.0.105:3000/handledislike", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, email: email }),
    });

    const result = await response.json();

    if (result.message) {
      console.log("done");
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(
          "http://192.168.0.105:3000/fetchProfiles",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );

        const result = await response.json();
        if (result.message === "done") {
          // Replace backslashes with forward slashes in profileImages paths
          const formattedProfiles = result.profile.map((profile) => ({
            ...profile,
            profileImages: profile.profileImages.map((path) =>
              path.replace(/\\/g, "/")
            ),
          }));
          setProfiles(formattedProfiles);
          setCurrentIndex(0); // Reset current index when profiles are updated
          console.log(profiles)
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
    const date = new Date();
  }, [email]); // Fetch profiles whenever email changes

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
          pan.setValue({ x: gestureState.dx, y: gestureState.dy });
          if (gestureState.dx > 0) {
            swipeLeftOpacity.setValue(gestureState.dx / SWIPE_THRESHOLD);
            swipeRightOpacity.setValue(0);
          } else {
            swipeRightOpacity.setValue(-gestureState.dx / SWIPE_THRESHOLD);
            swipeLeftOpacity.setValue(0);
          }
        },
        onPanResponderRelease: (evt, gestureState) => {
          if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
            const direction = gestureState.dx > 0 ? "left" : "right"; // Reverse direction logic
            Animated.parallel([
              Animated.timing(pan, {
                toValue: {
                  x: direction === "right" ? width : -width,
                  y: gestureState.dy,
                },
                duration: 200,
                useNativeDriver: false,
              }),
              Animated.timing(
                direction === "right" ? swipeRightOpacity : swipeLeftOpacity,
                {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: false,
                }
              ),
            ]).start(() => {
              handleSwipe(direction);
            });
          } else {
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              friction: 4,
              useNativeDriver: false,
            }).start();
            swipeLeftOpacity.setValue(0);
            swipeRightOpacity.setValue(0);
          }
        },
      }),
    [currentIndex, profiles]
  );

  const handleSwipe = (direction) => {
    // Logic for handling swipe direction (right for like, left for dislike)
    if (direction === "right") {
      console.log("Liked:", profiles[currentIndex].name);
      handleLikeBackend(profiles[currentIndex]._id);
      // Perform like action here
    } else {
      console.log("Disliked:", profiles[currentIndex].name);
      handledislikeBackend(profiles[currentIndex]._id);
      // Perform dislike action here
    }
    // Move to the next profile
    if (currentIndex < profiles.length) {
      setCurrentIndex(currentIndex + 1);
    }
    console.log(currentIndex)
    // Reset pan value for next profile
    pan.setValue({ x: 0, y: 0 });
  };

  const triggerDislike = () => {
    Animated.parallel([
      Animated.timing(swipeLeftOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(pan, {
        toValue: { x: -width, y: 0 },
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      handleSwipe("left");
      swipeLeftOpacity.setValue(0);
    });
  };

  const triggerlike = () => {
    Animated.parallel([
      Animated.timing(swipeRightOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(pan, {
        toValue: { x: -width, y: 0 },
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      handleSwipe("right");
      swipeRightOpacity.setValue(0);
    });
  };

  const getCardStyle = () => {
    const rotate = pan.x.interpolate({
      inputRange: [-width / 2, 0, width / 2],
      outputRange: ["-10deg", "0deg", "10deg"],
      extrapolate: "clamp",
    });

    const scale = pan.x.interpolate({
      inputRange: [-width / 2, 0, width / 2],
      outputRange: [0.6, 1, 0.6],
      extrapolate: "clamp",
    });

    return {
      ...pan.getLayout(),
      transform: [{ rotate }, { scale }],
    };
  };

  const renderProfile = (profile, index) => {
    // console.log(currentIndex)
    if (index !== currentIndex) {
      return null; // Only render the current profile in the stack
    }

    const animatedCardStyle = {
      ...getCardStyle(),
      opacity: index === currentIndex ? 1 : 0,
      position: "absolute",
      top: "38%", // Center vertically
      left: "45%", // Center horizontally
      width: width * 0.9, // 80% of screen width
      height: height * 0.72, // 60% of screen height
      marginLeft: -(width * 0.8) / 2, // Offset marginLeft by half of width
      marginTop: -(height * 0.6) / 2, // Offset marginTop by half of height
    };

    const swipeLeftStyle = {
      opacity: swipeLeftOpacity,
      transform: [{ rotate: "30deg" }],
    };

    const swipeRightStyle = {
      opacity: swipeRightOpacity,
      transform: [{ rotate: "-30deg" }],
    };

    const cardStyle = {
      ...styles.card,
      zIndex: profiles.length - index,
    };

    return (
      <>
        {profiles && profiles.length > 0 ? (
          <Animated.View
            id={index}
            {...panResponder.panHandlers}
            key={profile._id}
            style={[cardStyle, animatedCardStyle]}
          >
            <Image
              source={{
                uri: `http://192.168.0.105:3000/${profile.profileImages[0]}`,
              }}
              style={styles.image}
            />
            <LinearGradient
              colors={["rgba(0,0,0,0.8)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.overlay}
            />
            <View style={styles.overlayTextContainer}>
              <Animated.View
                style={[styles.overlay, styles.leftOverlay, swipeRightStyle]}
              >
                <Text style={styles.overlayText}>LIKE</Text>
              </Animated.View>
              <Animated.View
                style={[styles.overlay, styles.rightOverlay, swipeLeftStyle]}
              >
                <Text style={styles.overlayText}>DISLIKE</Text>
              </Animated.View>
            </View>
            <View style={styles.textContainer}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.name}>{profile.name}, </Text>
                <Text style={styles.name}>{profile.age}</Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                {profile.interests.map((interest, index) => (
                  <View key={index} style={{ marginRight: 20 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: "white",
                        fontWeight: "400",
                      }}
                    >
                      {interest}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View
              style={{
                position: "absolute",
                bottom: -30,
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
                alignItems: "center",
                zIndex: 1,
              }}
            >
              <Pressable style={styles.circle} onPress={triggerDislike}>
                <AntDesign
                  name="close"
                  size={24}
                  color="red"
                  style={styles.icons}
                />
              </Pressable>
              <Pressable
                style={[styles.circle, { width: 70, height: 70 }]}
                onPress={triggerlike}
              >
                <AntDesign
                  name="heart"
                  size={26}
                  color="#E03368"
                  style={styles.icons}
                />
              </Pressable>
              <Pressable
                style={styles.circle}
                onPress={() => handleSwipe("right")}
              >
                <AntDesign
                  name="star"
                  size={24}
                  color="#FF84A7"
                  style={styles.icons}
                />
              </Pressable>
            </View>
          </Animated.View>
        ) : (
          null
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      {currentIndex < profiles.length ? (
        profiles.map((profile, index) => renderProfile(profile, index))
      ) : (
        <Text style={styles.endText}>You have viewed all profiles! Please come back after some times</Text>
      )}
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "#fff",
    position: "relative",
  },
  image: {
    flex: 1,
    borderRadius: 30,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  overlayTextContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure text overlays are above image
  },
  leftOverlay: {
    position: "absolute",
    left: 20,
    transform: [{ rotate: "30deg" }],
  },
  rightOverlay: {
    position: "absolute",
    right: 20,
    transform: [{ rotate: "-30deg" }],
  },
  overlayText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  textContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
  },
  details: {
    fontSize: 18,
    color: "#fff",
  },

  circle: {
    backgroundColor: "#fff",
    // padding: 15,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
  },

  icons: {
    padding: 10,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowColor: "#000",
    elevation: 5,
  },

  endText:{
    margin:20,
    fontSize:24,
    fontWeight:'600',
    textAlign:'center'
  }
});
