// Bottom-tab navigator: defines the Home, Explore, and Profile tabs and their shared tab icon UI.
import icons from '@/constants/icons';

import { Tabs } from 'expo-router';
import React from 'react';
import { Image, ImageSourcePropType, Text, View } from "react-native";

// Renders one tab icon/label pair and switches color based on focus state.
const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}) => (
  <View className="flex-1 mt-3 flex flex-col items-center">
    <Image
      source={icon}
      tintColor={focused ? "#0061FF" : "#666876"}
      resizeMode="contain"
      className="size-6"
    />
    <Text
      className={`${
        focused
          ? "text-primary-300 font-rubik-medium"
          : "text-black-200 font-rubik"
      } text-xs w-full text-center mt-1`}
    >
      {title}
    </Text>
  </View>
);

const TabsLayout = () => {
  return (
    <Tabs
        // Hide default labels because TabIcon renders both icon and label manually.
        screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
            backgroundColor: "white",
            position: "absolute",
            borderTopColor: "#0061FF1A",
            borderTopWidth: 1,
            minHeight: 70,
            },
        }}
    >
       <Tabs.Screen
            name="index"
            options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
                <TabIcon focused={focused} icon={icons.home} title="Home" />
            ),
            }}
        />

         <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Explore" />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />

    </Tabs>
  );
};

export default TabsLayout