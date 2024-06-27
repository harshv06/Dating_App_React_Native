import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
  Button,
} from "react-native";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const OtpVerification = () => {
  const [codefilled, setcodefilled] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [enteredCode, setCode] = useState(false);
  const router = useRouter();
  const [counter, setCounter] = useState(30);
  const [isCounting, setIsCounting] = useState(true);
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    let timer;
    if (isCounting && counter > 0) {
      timer = setTimeout(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);
    } else if (counter === 0) {
      setIsCounting(false);
    }
    return () => clearTimeout(timer);
  }, [counter, isCounting]);
  
  const { name, email, password, code } = useLocalSearchParams();
  const user = {
    name: name,
    email: email,
    password: password,
    code: code,
  };

  const handleVerify = () => {
    setIsButtonClicked(true);

    // Simulate verification process (replace with actual logic)
    setTimeout(() => {
      // Assuming correctCode is the correct verification code
      const correctCode = user.code;
      console.log(correctCode, enteredCode);
      if (correctCode === enteredCode) {
        setIsVerificationComplete(true);
        const userD = {
          name: user.name,
          email: user.email,
          password: user.password,
          verified: true,
        };
        console.log("UserD: ", userD);

        fetch("http://192.168.0.105:3000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userD),
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.message) {
              Alert.alert("Success", "User Verified Sucessfully", [
                {
                  text: "Ok",
                  onPress: () => {
                    router.push(`/profileDetails/?username=${name}&useremail=${email}`);
                  },
                },
              ]);
            }
          });
        // Navigate to next screen after waiting period
      } else {
        // Show error message or handle incorrect code
        console.log("Incorrect code entered");
        // Reset state or show error message to user
        setIsButtonClicked(false);
      }
    }, 3000); // Simulating a 3-second verification process
  };

  const handleResendOtp = () => {
    setCounter(30);
    setIsCounting(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ margin: 20 }}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={{ fontSize: 26, fontWeight: "bold" }}>
            Enter Verification Code
          </Text>
          <Text style={{ marginTop: 10, color: "gray", fontSize: 14 }}>
            We have sent code to your email
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#E03368",
              marginTop: 3,
              fontWeight: "600",
            }}
          >
            vishwakarmah45@gmail.com
          </Text>
        </Animated.View>
        <Animated.View style={{ opacity: fadeAnim }}>
          <OTPInputView
            style={{
              width: "90%",
              height: 100,
              marginTop: 10,
              alignSelf: "center",
            }}
            pinCount={6}
            autoFocusOnLoad
            codeInputFieldStyle={[styles.underlineStyleBase]}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(code) => {
              setCode(code);
              setcodefilled(true);
            }}
          />
        </Animated.View>

        <View
          style={{
            position: "absolute",
            right: 25,
            top: "66%",
          }}
        >
          {counter === 0 ? (
            <Pressable
              onPress={() => {
                handleResendOtp()
              }}
            >
              <Text style={{ color: "#E03368", fontWeight: "600" }}>
                Resend OTP
              </Text>
            </Pressable>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 16 }}>Resend it:</Text>
              <Text style={{ color: "#E03368", fontSize: 16 }}>
                00.{counter}s
              </Text>
            </View>
          )}
        </View>

        <Animated.View style={{ opacity: fadeAnim, marginTop: 30 }}>
          {codefilled ? (
            <LinearGradient
              colors={["#FF84A7", "#E03368"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.verifyButton}
            >
              <Pressable
                style={[
                  isButtonClicked && {
                    backgroundColor: "#E03368",
                    flex: 1,
                    justifyContent: "center",
                  },
                ]}
                onPress={!isButtonClicked ? handleVerify : undefined}
                disabled={isButtonClicked}
              >
                <Text style={styles.verifyButtonText}>
                  {!isVerificationComplete
                    ? isButtonClicked
                      ? "Verifying..."
                      : "Verify"
                    : "Verified"}
                </Text>
              </Pressable>
            </LinearGradient>
          ) : (
            <LinearGradient
              colors={["gray", "gray"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.verifyButton}
            >
              <Pressable
                style={[isButtonClicked]}
                onPress={!isButtonClicked ? handleVerify : undefined}
                disabled={true}
              >
                <Text style={styles.verifyButtonText}>
                  {!isVerificationComplete
                    ? isButtonClicked
                      ? "Verifying..."
                      : "Verify"
                    : "Verified"}
                </Text>
              </Pressable>
            </LinearGradient>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  underlineStyleBase: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E03368",
    color: "black",
    borderRadius: 100,
    backgroundColor: "white",
  },
  underlineStyleHighLighted: {
    borderColor: "black",
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
