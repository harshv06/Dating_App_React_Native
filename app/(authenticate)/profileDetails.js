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
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Fontisto } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const profileDetails = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [profilePic, setProfilePic] = useState(null);
  const [isVisible, setisVisible] = useState(false);
  const [name, setName] = useState("");
  const [email,setEmail]=useState("")
  const [number, setNumber] = useState("");
  const [date, setDate] = useState("");
  const [date2, setDate2] = useState("");
  const [address, setAddress] = useState("");
  const [occupation,setOccupation]=useState("")
  const [bio,setBio]=useState("")
  const router = useRouter();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const uploadData = async () => {
    if (!profilePic) {
      Alert.alert("please select image first");
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
    formData.append("name", name);
    formData.append("date", date);
    formData.append("number", number);
    formData.append("address", address);
    formData.append("email", email);
    formData.append("age", age);
    formData.append("occupation", occupation);
    formData.append("bio", bio);

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
        AsyncStorage.setItem("name",name)
        AsyncStorage.setItem("email",email)
        AsyncStorage.setItem("date",date)
        AsyncStorage.setItem("number",number)
        AsyncStorage.setItem("occupation",occupation)
        AsyncStorage.setItem("bio",bio)
        AsyncStorage.setItem("address",address)
        AsyncStorage.setItem("url",result.data)
        Alert.alert("Success", "Profile updated successfully!", [
          {
            text: "Ok",
            onPress: () => {
              router.replace(`/selectGender`);
            },
          },
        ]);
      } else {
        Alert.alert("Error updating profile", result.error);
      }
    } catch (err) {
      console.log("error while uploading data to the database");
    }
  };

  const handleConfirm = (date) => {
    const fDate = date.toLocaleDateString();
    setDate2(date);
    setDate(fDate);
    setisVisible(false);
  };
  
  useEffect(()=>{
    const fetchEmail=async()=>{
      const mail=await AsyncStorage.getItem("email")
      if(mail){
        setEmail(mail)
      }
    }
    fetchEmail()
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  },[fadeAnim])

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      automaticallyAdjustKeyboardInsets={true}
    >
      <KeyboardAvoidingView style={{ margin: 20 }}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={{ fontSize: 30, fontWeight: "700" }}>
            Add Profile Details
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "300",
              color: "gray",
              marginTop: 5,
            }}
          >
            Please add your profile details here
          </Text>
        </Animated.View>

        <Animated.View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 30,
            opacity: fadeAnim,
          }}
        >
          <Pressable onPress={pickImage}>
            <Image
              source={
                profilePic
                  ? { uri: profilePic }
                  : require("../../assets/images/profile.jpg")
              }
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <AntDesign
              name="edit"
              size={20}
              color="black"
              style={{ position: "absolute", right: 3, bottom: 0 }}
            />
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.inputContainer, { opacity: fadeAnim }]}>
          <View style={styles.inputBox}>
            <View style={{ marginLeft: 10, marginTop: 10 }}>
              <Text style={styles.text}>Name</Text>
              <TextInput
                style={[styles.textIp, { marginLeft: -10 }]}
                value={name}
                onChangeText={(name) => setName(name)}
              />
            </View>
          </View>
          <View style={styles.inputBox}>
            <View style={{ marginLeft: 10, marginTop: 10 }}>
              <Text style={styles.text}>Email Address</Text>
              <TextInput
                keyboardType="email-address"
                style={[styles.textIp, { marginLeft: -10 }]}
                value={email}
                editable={false}
              />
            </View>
          </View>
          <View style={styles.inputBox}>
            <View style={{ marginLeft: 10, marginTop: 10 }}>
              <Text style={styles.text}>occupation</Text>
              <TextInput
                keyboardType="email-address"
                style={[styles.textIp, { marginLeft: -10 }]}
                value={occupation}
                onChangeText={(name) => setOccupation(name)}
              />
            </View>
          </View>
          <View style={styles.inputBox}>
            <View style={{ marginLeft: 10, marginTop: 10 }}>
              <Text style={styles.text}>About Me</Text>
              <TextInput
                keyboardType="email-address"
                style={[styles.textIp, { marginLeft: -10 }]}
                value={bio}
                multiline={true}
                onChangeText={(name) => setBio(name)}
              />
            </View>
          </View>
          <View style={styles.inputBox}>
            <View style={{ marginLeft: 10, marginTop: 10 }}>
              <Text style={styles.text}>Mobile Number</Text>
              <TextInput
                keyboardType="number-pad"
                style={[styles.textIp, { marginLeft: -10 }]}
                value={number}
                onChangeText={(number) => setNumber(number)}
              />
            </View>
          </View>
          <View style={[styles.inputBox, {}]}>
            <View style={{ marginLeft: 10, marginTop: 10 }}>
              <Text style={styles.text}>Date of Birth</Text>
              <TextInput
                keyboardType="numbers-and-punctuation"
                value={date}
                editable={false}
                style={[styles.textIp, { marginLeft: -10 }]}
              />
            </View>
            <Pressable
              style={{ position: "absolute", right: 10, top: 17 }}
              onPress={() => setisVisible(true)}
            >
              <Fontisto name="date" size={24} color="#FF84A7" />
            </Pressable>
          </View>

          <View style={styles.inputBox}>
            <View style={{ marginLeft: 10, marginTop: 10 }}>
              <Text style={styles.text}>Enter Address</Text>
              <TextInput
                style={[styles.textIp, { marginLeft: -10 }]}
                value={address}
                onChangeText={(address) => setAddress(address)}
              />
            </View>
          </View>

          {/* <RNDateTimePicker mode="date" value={new Date()} themeVariant="light" /> */}
          <DateTimePickerModal
            onConfirm={handleConfirm}
            isVisible={isVisible}
            onCancel={() => setisVisible(false)}
          />
        </Animated.View>

        <Animated.View>
          <Pressable onPress={uploadData}>
            <LinearGradient
              colors={["#FF84A7", "#E03368"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                marginTop: 10,
                padding: 20,
                borderRadius: 7,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  alignSelf: "center",
                }}
              >
                Continue
              </Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default profileDetails;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 20,
  },

  inputBox: {
    borderWidth: 0.5,
    borderColor: "#FF84A7",
    borderRadius: 7,
    marginBottom: 20,
    // paddingVertical: 15,
  },
  text: {
    color: "#FF84A7",
  },

  textIp: {
    padding: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});
