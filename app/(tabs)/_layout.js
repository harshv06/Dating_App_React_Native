import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform } from "react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          height: 70,
          bottom: Platform.OS == "ios" ? -20 : 0,
          borderTopWidth: 0.5,
          borderTopColor: "black",
        },
        tabBarLabelStyle: {
          position: "absolute",
          fontSize: 10,
          bottom: Platform.OS == "ios" ? -15 : 8,
        },
        tabBarIconStyle: {
          position: "static",
          top: Platform.OS == "ios" ? 0 : -10,
        },
        tabBarActiveTintColor: "#FF84A7",
        tabBarInactiveTintColor: "black",
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profiles",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Feather name="eye" size={24} color="#FF84A7" />
            ) : (
              <Feather name="eye" size={24} color="black" />
            ),

          tabBarLabel: "Profile",
        }}
      />

      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="#FF84A7"
              />
            ) : (
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="black"
              />
            ),
        }}
      />

      <Tabs.Screen
        name="bio"
        options={{
          title: "Account",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="guy-fawkes-mask"
                size={24}
                color="#FF84A7"
              />
            ) : (
              <MaterialCommunityIcons
                name="guy-fawkes-mask"
                size={24}
                color="black"
              />
            ),
        }}
      />
    </Tabs>
  );
}
