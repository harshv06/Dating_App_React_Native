import {
    Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";

const selectGender = () => {
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userID = decodedToken.userId;
      setUserID(userID);
    };

    fetchUser();
  }, []);

  const updateGender=async()=>{

    try{
        fetch(`http://192.168.0.105:3000/users/${userID}/gender`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(option)
        }).then((res)=>res.json()).then((response)=>{
            if(response.message){
                router.replace("/(tabs)/bio")
            }
        })
    }catch(err){
        console.log("Error: ",err)
    }
  }
  const [userID, setUserID] = useState("");
  const [option, setOption] = useState("");
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ margin: 20 }}>
        <Pressable
          onPress={() => setOption("male")}
          style={{
            flexDirection: "row",
            backgroundColor: "#F0F0F0",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 12,
            marginTop: 25,
            borderRadius: 5,
            borderColor: option == "male" ? "#D0D0D0" : "transparent",
            borderWidth: option == "male" ? 1 : 0,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "500" }}>I am a Man</Text>
          <Image
            style={{ width: 50, height: 50 }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/12442/12442425.png",
            }}
          />
        </Pressable>
        <Pressable
          onPress={() => setOption("female")}
          style={{
            flexDirection: "row",
            backgroundColor: "#F0F0F0",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 12,
            marginTop: 25,
            borderRadius: 5,
            borderColor: option == "female" ? "#D0D0D0" : "transparent",
            borderWidth: option == "female" ? 1 : 0,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "500" }}>I am a Woman</Text>
          <Image
            style={{ width: 50, height: 50 }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/9844/9844179.png",
            }}
          />
        </Pressable>
        <Pressable
          onPress={() => setOption("non-binary")}
          style={{
            flexDirection: "row",
            backgroundColor: "#F0F0F0",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 12,
            marginTop: 25,
            borderRadius: 5,
            borderColor: option == "non-binary" ? "#D0D0D0" : "transparent",
            borderWidth: option == "non-binary" ? 1 : 0,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "500" }}>
            I am a Non-Binary
          </Text>
          <Image
            style={{ width: 50, height: 50 }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/12442/12442425.png",
            }}
          />
        </Pressable>

        {option && (
          <Pressable
          onPress={updateGender}
            style={{
              backgroundColor: "black",
              marginTop: 25,
              padding: 12,
              borderRadius: 4,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
              Done
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default selectGender;

const styles = StyleSheet.create({});
