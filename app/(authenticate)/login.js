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
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Modal from "react-native-modal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const profile = await AsyncStorage.getItem("profile");
        console.log(token,profile)
        if (token && profile==='true') {
          router.replace("/(tabs)/bio");
          return
        }
      } catch (err) {
        console.log(err);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    const user = {
      email: email,
      password: pass,
    };

    if (!email || !pass) {
      return;
    }

    try {

      fetch("http://192.168.0.105:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.error) {
            Alert.alert("Failed", "Invalid Credentials", [{ text: "Ok" }]);
            return
          }
          setModalVisible(true);
          if (response.token && response.profileGenerated) {
            console.log("hi")
            const token = response.token;
            AsyncStorage.setItem("token", token);
            AsyncStorage.setItem("profile", "true");
            setModalVisible(false);
            setTimeout(() => {
              router.push("/(tabs)/bio");
            }, 2000);
          } else {
            console.log("heelo")
            const token = response.token;
            AsyncStorage.setItem("auth", token);
            AsyncStorage.setItem("email",email)
            setModalVisible(false);
            setTimeout(() => {
              router.push("/(authenticate)/profileDetails");
            }, 1000);
          }
        });
    } catch (err) {
      setModalVisible(false);
      console.log("Error:", err);
    }
  };

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
              source={require("../../assets/images/Logo.png")}
            />
          </Animated.View>
        </View>

        <KeyboardAvoidingView style={styles.keyboardView}>
          <View style={styles.centeredView}>
            <Animated.Text style={[styles.loginText, { opacity: fadeAnim }]}>
              Login
            </Animated.Text>
            <Animated.Text style={[styles.loginText2, { opacity: fadeAnim }]}>
              Please enter your email & password to continue
            </Animated.Text>
          </View>

          <Animated.View style={[styles.inputContainer, { opacity: fadeAnim }]}>
            <MaterialIcons
              style={styles.icon}
              name="email"
              size={24}
              color="#FF84A7"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              placeholderTextColor="#FF84A7"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </Animated.View>

          <Animated.View style={[styles.inputContainer, { opacity: fadeAnim }]}>
            <AntDesign
              style={styles.icon}
              name="lock1"
              size={24}
              color="#FF84A7"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor="#FF84A7"
              value={pass}
              onChangeText={(text) => setPass(text)}
              secureTextEntry={true}
            />
          </Animated.View>

          <Animated.View
            style={[styles.optionsContainer, { opacity: fadeAnim }]}
          >
            <Text style={styles.optionText}>Keep Me Logged In</Text>
            <Text style={styles.forgotPasswordText}>Forgot Password</Text>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim }}>
            <LinearGradient
              style={styles.loginButton}
              colors={["#FF84A7", "#E03368"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Pressable onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
              </Pressable>
            </LinearGradient>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim }}>
            <Pressable
              onPress={() => router.replace("/register")}
              style={{ flexDirection: "row", justifyContent: "center" }}
            >
              <Text style={styles.registerText}>Dont't have an account?</Text>
              <Text style={[styles.registerText, { color: "#E03368" }]}>
                {" "}
                Signup
              </Text>
            </Pressable>
          </Animated.View>

          <Modal isVisible={isModalVisible}>
            <View
              style={{
                backgroundColor: "gray",
                alignItems: "center",
                justifyContent: "center",
                height: "15%",
                width: "80%",
                alignSelf: "center",
              }}
            >
              <ActivityIndicator size="small" color="pink" />
              <Text style={{ margin: 10, fontSize: 16, fontWeight: "600" }}>
                Please wait
              </Text>
            </View>
          </Modal>

          <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
            <View style={styles.lines}></View>
            <Text style={{ color: "black" }}>Or Signup with</Text>
            <View style={styles.lines}></View>
          </Animated.View>

          <Animated.View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
              opacity: fadeAnim,
            }}
          >
            <Pressable style={styles.buttons}>
              <Image
                source={require("../../assets/images/google.png")}
                style={{ width: 50, height: 50 }}
              />
              <Text style={styles.buttonText}>Google</Text>
            </Pressable>
            <Pressable style={styles.buttons}>
              <Image
                source={require("../../assets/images/fb.png")}
                style={{ width: 30, height: 30, marginLeft: 5 }}
              />
              <Text style={[styles.buttonText, { marginLeft: 12 }]}>
                Facebook
              </Text>
            </Pressable>
          </Animated.View>
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
    height: 200,
    backgroundColor: "white",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 25,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  keyboardView: {
    width: "85%",
  },
  centeredView: {
    alignItems: "",
  },
  loginText: {
    fontSize: 30,
    fontWeight: "600",
    marginTop: 20,
    color: "#333",
  },
  loginText2: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12,
    color: "gray",
  },

  inputContainer: {
    backgroundColor: "white",
    paddingVertical: 8,
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
    borderWidth: 0.5,
    borderColor: "#E03368",
  },
  icon: {
    marginLeft: 10,
  },
  input: {
    color: "black",
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
    height: 55,
    alignItems: "center",
    justifyContent: "center",
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
    paddingHorizontal: 80,
    paddingVertical: 20,
  },
  registerText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
    marginTop: 10,
  },

  footer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },

  lines: {
    backgroundColor: "gray",
    width: "30%",
    height: 1,
    margin: 10,
  },
  buttons: {
    borderColor: "gray",
    borderWidth: 0.5,
    width: "49%",
    borderRadius: 10,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 17,
    fontWeight: "300",
  },

  verifyButton: {
    height: 50,
    borderRadius: 10,
    alignSelf: "center",
    width: "90%",
    justifyContent: "center",
  },
  verifyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
