import {
  StyleSheet,
  Text,
  View,
  Animated,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { Entypo } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const chatRoom = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  return (
    <Animated.View
      style={{ flex: 1, backgroundColor: "#fff", opacity: fadeAnim }}
    >
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        contentContainerStyle={{flexGrow:1}}
        style={{ margin: 20,marginTop:5 }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            borderBottomColor: "black",
            borderBottomWidth: 0.2,
            paddingBottom: 10,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              backgroundColor: "black",
              borderRadius: 80,
            }}
          ></View>
          <Text
            style={{
              fontWeight: "500",
              fontSize: 20,
              shadowColor: "black",
              shadowOffset: { height: 1, width: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
            }}
          >
            Harsh V
          </Text>
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              right: 10,
              gap: 20,
            }}
          >
            <Entypo name="video-camera" size={30} color="gray" />
            <Foundation name="telephone" size={30} color="gray" />
          </View>
        </View>
        {/* <ScrollView style={{ height: 300,backgroundColor:'red', width: "100%"}}></ScrollView> */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            height: "8%",
            gap: 10,
            // position:"absolute",
            // bottom:-50
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "gray",
              alignItems: "center",
              borderRadius: 9,
              gap: 8,
            }}
          >
            <View style={{ marginLeft: 10 }}>
              <FontAwesome5 name="camera" size={24} color="black" />
            </View>
            <TextInput
              style={{ height: "100%", paddingRight: 120, borderRadius: 9 }}
              placeholder="Type Something..."
            />
          </View>

          <LinearGradient
            colors={["#FF84A7", "#E03368"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: "17%", alignItems: "center", borderRadius: 9 }}
          >
            <Pressable style={{ height: "100%", justifyContent: "center" }}>
              <FontAwesome name="send" size={24} color="white" />
            </Pressable>
          </LinearGradient>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default chatRoom;

const styles = StyleSheet.create({});
