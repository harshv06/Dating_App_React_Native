import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
const selectInrests = () => {
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

  const router=useRouter()

  const interestsData = [
    { id: 1, name: "Music", selected: false, icon: "music" }, //,paint-brush,glass,shopping-cart,braille,camera,thumbs-o-up
    { id: 2, name: "Sports", selected: false, icon: "soccer-ball-o" },
    { id: 3, name: "Movies", selected: false, icon: "video-camera" },
    { id: 4, name: "Books", selected: false, icon: "book" },
    { id: 5, name: "Travel", selected: false, icon: "plane" },
    { id: 6, name: "Fitness", selected: false, icon: "heartbeat" },
    { id: 7, name: "Snooker", selected: false, icon: "gamepad" },
    { id: 8, name: "Art", selected: false, icon: "paint-brush" },
    { id: 9, name: "Clubbing", selected: false, icon: "glass" },
    { id: 10, name: "Shopping", selected: false, icon: "shopping-cart" },
    { id: 11, name: "Groups", selected: false, icon: "group" },
    { id: 12, name: "Photography", selected: false, icon: "camera" },
    { id: 13, name: "Socialize", selected: false, icon: "thumbs-o-up" },
    // Add more interests as needed
  ];

  const [interests, setInterests] = useState(interestsData);
  const [userinterests, setuserInterests] = useState([]);
  const [btn, setBtn] = useState(false);

  const toggleInterest = (id) => {
    setBtn(true);
    const updatedInterests = interests.map((interest) =>
      interest.id === id
        ? { ...interest, selected: !interest.selected }
        : interest
    );

    const Uinterests = updatedInterests.find((interest) => interest.id === id);
    let updatedUinterest;
    if (Uinterests.selected) {
      updatedUinterest = [...userinterests, Uinterests.name];
    } else {
      updatedUinterest = userinterests.filter(
        (interest) => interest !== Uinterests.name
      );
    }

    setInterests(updatedInterests);
    setuserInterests(updatedUinterest);
  };

  const renderInterests = () => {
    return interests.map((interest) => (
      <Pressable key={interest.id} onPress={() => toggleInterest(interest.id)}>
        <LinearGradient
          colors={
            interest.selected ? ["#FF84A7", "#E03368"] : ["white", "white"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.interestBox,
            interest.selected && styles.selectedInterest,
          ]}
        >
          <FontAwesome
            name={interest.icon}
            size={18}
            color={interest.selected ? "white" : "black"}
          />
          <Text
            style={[
              styles.interestText,
              { color: interest.selected ? "white" : "black" },
            ]}
          >
            {interest.name}
          </Text>
        </LinearGradient>
      </Pressable>
    ));
  };

  const uploadInterest = async () => {
    const response = await fetch(
      `http://192.168.0.105:3000/uploadInterests/?email=${email}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userinterests),
      }
    );

    const result = await response.json();
    if (result.message) {
      AsyncStorage.setItem("profile","true")
      Alert.alert("Success","Details Uploaded",[
        {
            text:"ok",
            onPress:()=>{
                router.replace("/(tabs)/bio")
            }
        }
      ]);
    } else {
      Alert.alert("Error");
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={{ margin: 10 }}>
        <Text style={styles.header}>Select Your Interests</Text>
        <Text
          style={{
            fontSize: 15,
            color: "gray",
            fontWeight: "300",
            textAlign: "left",
          }}
        >
          Select a few of your intrest to match with users who have similar
          things in common
        </Text>
        <View style={styles.interestsContainer}>{renderInterests()}</View>

        {btn && (
          <Pressable style={{ marginTop: 30 }} onPress={uploadInterest}>
            <LinearGradient
              colors={["#FF84A7", "#E03368"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 20,
                borderRadius: 7,
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  color: "white",
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                Continue
              </Text>
            </LinearGradient>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
};

export default selectInrests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 10,
  },
  interestsContainer: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  interestBox: {
    borderRadius: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  interestText: {
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 5,
  },
  selectedInterest: {
    backgroundColor: "#FF84A7",
    borderWidth: 1,
    borderColor: "#FF84A7",
    // Change color for selected interest
  },
});
