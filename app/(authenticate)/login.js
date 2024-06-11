
import React, { useState, useRef, useEffect } from "react";
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
  Animated,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <ScrollView style={styles.scrollView}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
            <Image
              style={styles.logo}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/6655/6655045.png",
              }}
            />
            <Text style={styles.title}>Match Mate</Text>
          </Animated.View>
        </View>

        <KeyboardAvoidingView style={styles.keyboardView}>
          <View style={styles.centeredView}>
            <Animated.Text style={[styles.loginText, { opacity: fadeAnim }]}>
              Log in to your Account
            </Animated.Text>
          </View>

          <Animated.Image
            style={[styles.mainImage, { opacity: fadeAnim }]}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/2509/2509078.png",
            }}
          />

          <Animated.View style={[styles.inputContainer, { opacity: fadeAnim }]}>
            <MaterialIcons style={styles.icon} name="email" size={24} color="white" />
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              placeholderTextColor="#ffffffa5"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </Animated.View>

          <Animated.View style={[styles.inputContainer, { opacity: fadeAnim }]}>
            <AntDesign style={styles.icon} name="lock1" size={24} color="white" />
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor="#ffffffa5"
              value={pass}
              onChangeText={(text) => setPass(text)}
              secureTextEntry={true}
            />
          </Animated.View>

          <View style={styles.optionsContainer}>
            <Text style={styles.optionText}>Keep Me Logged In</Text>
            <Text style={styles.forgotPasswordText}>Forgot Password</Text>
          </View>

          <Pressable style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>

          <Pressable onPress={() => router.replace("/register")}>
            <Text style={styles.registerText}>
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    alignItems: "center",
  },
  header: {
    height: 250,
    backgroundColor: "#F9629F",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 25,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 80,
    resizeMode: "contain",
  },
  title: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: "white",
  },
  keyboardView: {
    width: "85%",
  },
  centeredView: {
    alignItems: "center",
  },
  loginText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 25,
    color: "#333",
  },
  mainImage: {
    width: 100,
    height: 80,
    resizeMode: "cover",
    alignSelf: "center",
    marginTop: 20,
  },
  inputContainer: {
    backgroundColor: "#FFC0CB",
    paddingVertical: 10,
    flexDirection: "row",
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginLeft: 10,
  },
  input: {
    color: "white",
    marginVertical: 10,
    marginHorizontal: 10,
    width: 280,
    fontSize: 17,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  optionText: {
    marginLeft: 5,
    color: "#333",
  },
  forgotPasswordText: {
    marginRight: 5,
    color: "#007FFF",
    fontWeight: "500",
  },
  loginButton: {
    alignSelf: "center",
    marginTop: 30,
    backgroundColor: "#F9629F",
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    borderRadius: 10,
    width: "65%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  registerText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
    marginTop: 10,
  },
});

