import {
  Alert,
  Animated,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "core-js/stable/atob";
import { router, useLocalSearchParams } from "expo-router";
import { Foundation } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const SelectGender = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [email,setEmail]=useState("")
  useEffect(() => {
    const fetchData=async()=>{
      const mail=await AsyncStorage.getItem("email")
      if(mail){
        setEmail(mail)
      }
    }
    fetchData()
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const updateGender = async () => {
    console.log("Here")
    try {
      fetch(`http://192.168.0.105:3000/users/gender`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gender: option, email: email }),
      })
        .then((res) => res.json())
        .then((response) => {
          console.log(response)
          AsyncStorage.setItem("gender",option)
          if (response.message) {
            router.replace(`/selectInrests`);
          }
        });
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const [option, setOption] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Animated.View style={{ margin: 20, opacity: fadeAnim }}>
        <View>
          <Text style={{ fontSize: 28, fontWeight: "500" }}>Select Gender</Text>
          <Text
            style={{
              fontSize: 14,
              marginTop: 5,
              color: "gray",
              fontWeight: "400",
            }}
          >
            Please select your gender
          </Text>
        </View>

        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Pressable
            style={[
              styles.buttons,
              option === "male" && styles.selectedButton,
              option === "male" && styles.selectedButtonSize,
            ]}
            onPress={() => setOption("male")}
          >
            <Foundation
              name="male-symbol"
              size={60}
              color={option === "male" ? "#E03368" : "black"}
            />
            <Text style={styles.text}>Male</Text>
          </Pressable>
          <Pressable
            style={[
              styles.buttons,
              { marginTop: 50 },
              option === "female" && styles.selectedButton,
              option === "female" && styles.selectedButtonSize,
            ]}
            onPress={() => setOption("female")}
          >
            <Foundation
              name="female-symbol"
              size={60}
              color={option === "female" ? "#E03368" : "black"}
            />
            <Text style={styles.text}>Female</Text>
          </Pressable>
        </View>

        {option && (
          <Pressable onPress={updateGender}>
            <LinearGradient
              colors={["#FF84A7", "#E03368"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                }}
              >
                Done
              </Text>
            </LinearGradient>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
};

export default SelectGender;

const styles = StyleSheet.create({
  buttons: {
    borderWidth: 0.5,
    borderColor: "gray",
    marginTop: 20,
    width: "55%",
    height: "37%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  selectedButton: {
    borderColor: "#FF84A7",
    backgroundColor: "#fae3ea",
    borderWidth: 1,
  },
  selectedButtonSize: {
    transform: [{ scale: 1.1 }],
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
  },
  gradientButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
});
