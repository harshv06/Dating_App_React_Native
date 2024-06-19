import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image
} from "react-native";

import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileButton = ({ icon, label, onPress }) => (
  <Pressable style={styles.btnContainer} onPress={onPress}>
    <View style={styles.btn}>
      {icon}
      <Text style={styles.btnText}>{label}</Text>
    </View>
    <AntDesign name="caretright" size={16} color="gray" />
  </Pressable>
);

const index = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const email = "harshvonmail@gmail.com";
  const router = useRouter();

  const handleLogout = async () => {
    AsyncStorage.setItem("token", "");
    const token=await AsyncStorage.getItem("token")
    console.log(token)
    router.replace("/(authenticate)/login");
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  return (
    <Animated.View style={{ ...styles.animatedView, opacity: fadeAnim }}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <Image source={require('../../../api/uploads/1718819088117.jpg')} style={{width:80,height:80}}/>
            </View>
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>Harsh Vishwakarma</Text>
              <Text style={styles.profileEmail}>{email}</Text>
            </View>
          </View>

          <View style={styles.profileButtons}>
            <ProfileButton
              icon={
                <MaterialCommunityIcons
                  name="account-box"
                  size={24}
                  color="gray"
                />
              }
              label="Personal Details"
              onPress={()=>router.push("/(tabs)/bio/personalDetails")}
            />
            <ProfileButton
              icon={<MaterialIcons name="settings" size={24} color="gray" />}
              label="Settings"
              onPress={() => console.log("Settings")}
            />
            <ProfileButton
              icon={
                <MaterialCommunityIcons name="earth" size={24} color="gray" />
              }
              label="Terms & Conditions"
              onPress={() => console.log("Terms & Conditions")}
            />
            <ProfileButton
              icon={<MaterialIcons name="doorbell" size={24} color="gray" />}
              label="Privacy Policy"
              onPress={() => console.log("Privacy Policy")}
            />
            <ProfileButton
              icon={
                <MaterialCommunityIcons
                  name="account-eye"
                  size={24}
                  color="gray"
                />
              }
              label="About us"
              onPress={() => console.log("About us")}
            />
          </View>

          <LinearGradient
            colors={["#FF84A7", "#E03368"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              alignItems: "center",
              borderRadius: 7,
              position: "static",
              bottom: -130,
            }}
          >
            <Pressable
              onPress={handleLogout}
              style={{ padding: 20, width: "100%", alignItems: "center" }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "500",
                }}
              >
                Log out
              </Text>
            </Pressable>
          </LinearGradient>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default index;

const styles = StyleSheet.create({
  animatedView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  container: {
    margin: 20,
  },
  profileHeader: {
    alignItems: "center",
  },
  profileImageContainer: {
    height: 80,
    width: 80,
    backgroundColor: "gray",
    borderRadius: 100,
  },
  profileTextContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "600",
  },
  profileEmail: {
    fontWeight: "400",
    color: "gray",
  },
  profileButtons: {
    marginTop: 20,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "black",
    borderBottomWidth: 0.3,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
