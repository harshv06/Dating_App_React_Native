import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useRoute } from "@react-navigation/native";

const OtpVerification = () => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [enteredCode, setCode] = useState();
  const router = useRouter();

  const route = useRoute();
  const { name, email, password, code } = useLocalSearchParams();
  const user = {
    name: name,
    email: email,
    password: password,
    code: code,
  };

  console.log(user);

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
                    router.replace("/register");
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <OTPInputView
          style={{ width: "80%", height: 200, marginTop: 100 }}
          pinCount={6}
          autoFocusOnLoad
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled={(code) => {
            setCode(code);
            console.log(`Code is ${code}, you are good to go!`);
          }}
        />

        <Pressable
          style={[
            styles.verifyButton,
            isButtonClicked && { backgroundColor: "#ccc" },
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: "#F9629F",
  },
  underlineStyleHighLighted: {
    borderColor: "#F9629F",
  },
  verifyButton: {
    backgroundColor: "#F9629F",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  verifyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
