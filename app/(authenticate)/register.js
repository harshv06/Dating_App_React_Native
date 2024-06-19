import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: pass,
    };

    setModalVisible(true);
    // Your registration logic here
    fetch("http://192.168.0.105:3000/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json()) // Parse the JSON response
      .then((response) => {
        console.log(response); // Check the response data
        if (response.message) {
          setModalVisible(false);
          Alert.alert("Success", "Verification code sent to email id", [
            {
              text: "Ok",
              onPress: () => {
                // Assuming `data` is a property of the response containing the data to be passed
                const data = response.data;
                // console.log(data[0])
                router.push(
                  `/otpVerification/?name=${data[0]}&email=${data[1]}&password=${data[2]}&code=${data[3]}`
                ); // Pass data to next screen
              },
            },
          ]);
        }else{
          Alert.alert("Failed","Please Try Again")
          setModalVisible(false)
          return
        }
        setModalVisible(false)
        // Alert.alert("Failed",response.error)
      })
      .catch((err) => {
        setModalVisible(false)
        console.log("Erro", err);
      });
  };

  return (
    <ScrollView
      style={styles.scrollView}
      automaticallyAdjustKeyboardInsets={true}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
            <Image
              style={styles.logo}
              source={require("../../assets/images/Logo.png")}
            />
            <Text style={styles.title}>Signup to Continue</Text>
            <Text style={styles.titleText}>Please login to continue</Text>
          </Animated.View>
        </View>

        <KeyboardAvoidingView style={styles.keyboardView}>
          <Animated.View style={[styles.inputContainer, { opacity: fadeAnim }]}>
            <Ionicons
              style={styles.icon}
              name="person-sharp"
              size={24}
              color="#FF84A7"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              placeholderTextColor="#FF84A7"
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </Animated.View>

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

          <Modal isVisible={isModalVisible}>
            <View
              style={{
                height: "20%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
              }}
            >
              <ActivityIndicator size="small" color="#F9629F" />
              <Text style={{ marginTop: 20, fontWeight: "700" }}>
                Please Wait Email Is Being Sent
              </Text>
            </View>
          </Modal>

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

          <Animated.View style={{ opacity: fadeAnim }}>
            <LinearGradient
              colors={["#FF84A7", "#E03368"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.registerButton}
            >
              <Pressable onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Register</Text>
              </Pressable>
            </LinearGradient>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim }}>
            <Pressable
              onPress={() => router.replace("/login")}
              style={{ flexDirection: "row", justifyContent: "center" }}
            >
              <Text style={styles.loginText}>Already have an account?</Text>
              <Text style={[styles.loginText, { color: "#E03368" }]}>
                {" "}
                Log in
              </Text>
            </Pressable>
          </Animated.View>

          <Animated.View style={[styles.footer,{opacity:fadeAnim}]}>
            <View style={styles.lines}></View>
            <Text style={{ color: "black" }}>Or Signup with</Text>
            <View style={styles.lines}></View>
          </Animated.View>

          <Animated.View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
              opacity:fadeAnim
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

          <Animated.View style={{ alignItems: "center", marginTop: 15,opacity:fadeAnim }}>
            <Text>I accept all the</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: "#E03368" }}>Terms & Conditions </Text>
              <Text>&</Text>
              <Text style={{ color: "#E03368" }}> Privacy Policy</Text>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    alignItems: "center",
  },
  header: {
    height: 250,
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
  title: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "black",
  },
  titleText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: "#989394",
  },
  keyboardView: {
    width: "85%",
  },
  centeredView: {
    alignItems: "center",
  },
  registerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 25,
    color: "#333",
  },

  inputContainer: {
    backgroundColor: "white",
    paddingVertical: 8,
    flexDirection: "row",
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderColor: "#E03368",
    borderWidth: 0.5,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  registerButton: {
    alignSelf: "center",
    marginTop: 30,
    backgroundColor: "#F9629F",
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "400",
    color: "white",
  },
  loginText: {
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
});
