import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Animated,
  Alert,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Fontisto } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PersonalDetails = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [profilePic, setProfilePic] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("harshvonmail@gmail.com");
  const [number, setNumber] = useState("");
  const [date, setDate] = useState("");
  const [date2, setDate2] = useState(null);
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [bio, setBio] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData=async()=>{
      const name=await AsyncStorage.getItem("name")
      const occupation=await AsyncStorage.getItem("occupation")
      const bio=await AsyncStorage.getItem("bio")
      const number=await AsyncStorage.getItem("number")
      const date=await AsyncStorage.getItem("date")
      const address=await AsyncStorage.getItem("address")
      setName(name)
      setOccupation(occupation)
      setBio(bio)
      setNumber(number)
      setDate(date)
      setAddress(address)
    }

    fetchData()
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const uploadData = async () => {
    if (!profilePic) {
      Alert.alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", {
      uri: profilePic,
      type: "image/jpeg",
      name: "Profile.jpg",
    });

    const today = new Date();
    let age = today.getFullYear() - date2.getFullYear();
    const monthDifference = today.getMonth() - date2.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < date2.getDate())
    ) {
      age--;
    }

    const userDetails = {
      name,
      date,
      number,
      address,
      email,
      age,
      occupation,
      bio,
    };
    Object.keys(userDetails).forEach((key) =>
      formData.append(key, userDetails[key])
    );

    try {
      const response = await fetch(
        "http://192.168.0.105:3000/users/profileData",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      const result = await response.json();
      console.log("Result:", result.data);

      if (result.message) {
        Alert.alert("Success", "Profile updated successfully!", [
          {
            text: "Ok",
            onPress: () => {
              router.replace(`/selectGender/?email=${email}`);
            },
          },
        ]);
      } else {
        Alert.alert("Error updating profile", result.error);
      }
    } catch (err) {
      console.log("Error while uploading data to the database");
    }
  };

  const handleConfirm = (selectedDate) => {
    setDate2(selectedDate);
    setDate(selectedDate.toLocaleDateString());
    setIsVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ flex: 1 }} automaticallyAdjustKeyboardInsets={true}>
        <KeyboardAvoidingView style={{ margin: 20 }}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.header}>Add Profile Details</Text>
            <Text style={styles.subHeader}>
              Please add your profile details here
            </Text>
          </Animated.View>

          <Animated.View style={[styles.centeredView, { opacity: fadeAnim }]}>
            <Pressable onPress={pickImage}>
              <Image
                source={
                  profilePic
                    ? { uri: profilePic }
                    : require("../../../assets/images/profile.jpg")
                }
                style={styles.profileImage}
              />
              <AntDesign
                name="edit"
                size={20}
                color="black"
                style={styles.editIcon}
              />
            </Pressable>
          </Animated.View>

          <Animated.View style={[styles.inputContainer, { opacity: fadeAnim }]}>
            {renderInputField("Name", name, setName)}
            {renderInputField("Occupation", occupation, setOccupation)}
            {renderInputField("Bio", bio, setBio, true)}
            {renderInputField("Email Address", email, setEmail, false, true)}
            {renderInputField(
              "Mobile Number",
              number,
              setNumber,
              false,
              false,
              "number-pad"
            )}
            {renderInputField("Date of Birth", date, setDate, false, true)}
            <Pressable
              style={styles.datePicker}
              onPress={() => setIsVisible(true)}
            >
              <Fontisto name="date" size={24} color="#FF84A7" />
            </Pressable>
            {renderInputField("Enter Address", address, setAddress)}
          </Animated.View>

          <DateTimePickerModal
            onConfirm={handleConfirm}
            isVisible={isVisible}
            onCancel={() => setIsVisible(false)}
          />

          <Animated.View style={{ marginBottom: 50 }}>
            <Pressable onPress={uploadData}>
              <LinearGradient
                colors={["#FF84A7", "#E03368"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.continueButton}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const renderInputField = (
  label,
  value,
  setValue,
  multiline = false,
  editable = true,
  keyboardType = "default"
) => (
  <View style={styles.inputBox}>
    <View style={styles.inputBoxContent}>
      <Text style={styles.text}>{label}</Text>
      <TextInput
        style={[styles.textIp, { marginLeft: -10 }]}
        value={value}
        onChangeText={setValue}
        editable={editable}
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

export default PersonalDetails;

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    fontWeight: "700",
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "300",
    color: "gray",
    marginTop: 5,
  },
  centeredView: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: "absolute",
    right: 3,
    bottom: 0,
  },
  inputContainer: {
    marginTop: 20,
  },
  inputBox: {
    borderWidth: 0.5,
    borderColor: "#FF84A7",
    borderRadius: 7,
    marginBottom: 20,
  },
  inputBoxContent: {
    marginLeft: 10,
    marginTop: 10,
  },
  text: {
    color: "#FF84A7",
  },
  textIp: {
    padding: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  datePicker: {
    position: "absolute",
    right: 10,
    top: 17,
  },
  continueButton: {
    marginTop: 10,
    padding: 20,
    borderRadius: 7,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    alignSelf: "center",
  },
});
