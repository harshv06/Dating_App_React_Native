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

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isModalVisible,setModalVisible]=useState(false)
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

    setModalVisible(true)
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
          setModalVisible(false)
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
        }
      })
      .catch((err) => {
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
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/6655/6655045.png",
              }}
            />
            <Text style={styles.title}>Match Mate</Text>
          </Animated.View>
        </View>

        <KeyboardAvoidingView style={styles.keyboardView}>
          <View style={styles.centeredView}>
            <Animated.Text style={[styles.registerText, { opacity: fadeAnim }]}>
              Register to your Account
            </Animated.Text>
          </View>

          <Animated.Image
            style={[styles.mainImage, { opacity: fadeAnim }]}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/2509/2509078.png",
            }}
          />

          <Animated.View style={[styles.inputContainer, { opacity: fadeAnim }]}>
            <Ionicons
              style={styles.icon}
              name="person-sharp"
              size={24}
              color="white"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              placeholderTextColor="#ffffffa5"
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </Animated.View>

          <Animated.View style={[styles.inputContainer, { opacity: fadeAnim }]}>
            <MaterialIcons
              style={styles.icon}
              name="email"
              size={24}
              color="white"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              placeholderTextColor="#ffffffa5"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </Animated.View>

          <Modal isVisible={isModalVisible}>
            <View style={{ height:'20%',justifyContent:'center',alignItems:'center',backgroundColor:'white' }}>
            <ActivityIndicator size="small" color="#F9629F" />
              <Text style={{marginTop:20,fontWeight:'700'}}>Please Wait Email Is Being Sent</Text>
            </View>
          </Modal>

          <Animated.View style={[styles.inputContainer, { opacity: fadeAnim }]}>
            <AntDesign
              style={styles.icon}
              name="lock1"
              size={24}
              color="white"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor="#ffffffa5"
              value={pass}
              onChangeText={(text) => setPass(text)}
              secureTextEntry={true}
            />
          </Animated.View>

          <Pressable onPress={handleRegister} style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Register</Text>
          </Pressable>

          <Pressable onPress={() => router.replace("/login")}>
            <Text style={styles.loginText}>
              Already have an account? Log In
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Register;

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
  registerText: {
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
    marginTop: 20,
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
  registerButton: {
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
  registerButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  loginText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
    marginTop: 10,
  },
});
