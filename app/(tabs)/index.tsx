import { View, Text, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Header from "@/components/Header";

const HomeScreen = () => {
  const [isPending, setIsPending] = useState(true);
  return (
    <View className="flex-1 items-center bg-[#F5F7FA] relative">
      <StatusBar style="light" />

      {isPending && (
        <View className="absolute z-50 w-full h-full justify-center items-center">
          <View className="bg-[#000000] bg-opacity-50 h-full w-full justify-center items-center opacity-[0.45] "></View>
          <View>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        </View>
      )}

      {/* Header */}
      <View
        className="h-64 mb-4 justify-start border-orange-600 w-full bg-[#192031] relative pt-16"
        style={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
      >
        <Header />
      </View>

      {/* Form Area */}
    </View>
  );
};

export default HomeScreen;
