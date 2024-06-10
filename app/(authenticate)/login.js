import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <SafeAreaView style={{ alignItems: "center" }}>
        <View style={{ height: 200, backgroundColor: "pink", width: "100%" }}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 25,
            }}
          >
            <Image
              style={{ width: 150, height: 80, resizeMode: "contain" }}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/6655/6655045.png",
              }}
            />
          </View>
          <Text
            style={{
              marginTop: 20,
              textAlign: "center",
              fontSize: 20,
              fontFamily: "GillSans-SemiBold",
            }}
          >
            Match Mate
          </Text>
        </View>

        <KeyboardAvoidingView style={{ width: "85%" }}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                marginTop: 25,
                color: "#F9629F",
              }}
            >
              Log in to your Account
            </Text>
          </View>

          <Image
            style={{
              width: 100,
              height: 80,
              resizeMode: "cover",
              alignSelf: "center",
              marginTop: 20,
            }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/2509/2509078.png",
            }}
          />

          <View
            style={{
              backgroundColor: "#FFC0CB",
              paddingVertical: 5,
              gap: 5,
              flexDirection: "row",
              borderRadius: 5,
              marginTop: 30,
              alignItems: "center",
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="white"
            />

            <TextInput
              style={{
                color: "white",
                marginVertical: 10,
                marginHorizontal: 8,
                width: 300,
                fontSize: 17,
              }}
              placeholder="Enter Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>

          <View
            style={{
              backgroundColor: "#FFC0CB",
              paddingVertical: 5,
              gap: 5,
              flexDirection: "row",
              borderRadius: 5,
              marginTop: 30,
              alignItems: "center",
            }}
          >
            <AntDesign
              style={{ marginLeft: 8 }}
              name="lock1"
              size={24}
              color="white"
            />

            <TextInput
              style={{
                color: "white",
                marginVertical: 10,
                marginHorizontal: 8,
                width: 300,
                fontSize: 17,
              }}
              placeholder="Enter Password"
              value={pass}
              onChangeText={(text) => setPass(text)}
              secureTextEntry={true}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View style={{ marginLeft: 5 }}>
              <Text>Keep Me Logged In</Text>
            </View>
            <View style={{ marginRight: 5 }}>
              <Text style={{ color: "#007FFF", fontWeight: "500" }}>
                Forgot Password
              </Text>
            </View>
          </View>

          <View
            style={{
              alignSelf: "center",
              marginTop: 30,
              backgroundColor: "pink",
              padding: 10,
              width: "65%",
              padding: 15,
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500", color: "white" }}>
              Login
            </Text>
          </View>

          <Pressable onPress={()=>router.replace("/register")}>
            <Text
              style={{
                textAlign: "center",
                color: "gray",
                fontSize: 16,
                marginTop: 10,
              }}  
            >
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
};

export default login;

const styles = StyleSheet.create({});
