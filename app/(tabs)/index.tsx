import { View, Text, ActivityIndicator, Pressable } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Header from "@/components/Header";
import {
  ArrowPathRoundedSquareIcon,
  ChevronDoubleRightIcon,
} from "react-native-heroicons/outline";

// Trip Option Components
interface TripOptionProps {
  pageNavigation: string;
  handleNavigationChange: (type: string) => void;
}
const TripOption = ({
  pageNavigation,
  handleNavigationChange,
}: TripOptionProps) => (
  <View className="flex-row justify-between w-full px-4 py-2">
    <Pressable
      className="flex-row w-1/2"
      onPress={() => handleNavigationChange("oneWay")}
    >
      <View
        className={`w-full justify-center items-center flex-row space-x-2 pb-2 ${
          pageNavigation === "oneWay"
            ? "border-b-4 border-[#12B3A8]"
            : "border-t-transparent"
        }`}
      >
        <ChevronDoubleRightIcon
          size={20}
          strokeWidth={pageNavigation === "oneWay" ? 3 : 2}
          color={pageNavigation === "oneWay" ? "#12B3A8" : "gray"}
        />
        <Text
          className={`text-xl pl-2 ${
            pageNavigation === "oneWay" ? "text-[#12B3A8]" : "text-gray-500"
          }`}
          style={{ fontWeight: pageNavigation === "oneWay" ? "700" : "500" }}
        >
          One Way
        </Text>
      </View>
    </Pressable>
    <Pressable
      className="flex-row w-1/2"
      onPress={() => handleNavigationChange("roundTrip")}
    >
      <View
        className={`w-full justify-center items-center flex-row space-x-2 pb-2 ${
          pageNavigation === "roundTrip"
            ? "border-b-4 border-[#12B3A8]"
            : "border-t-transparent"
        }`}
      >
        <ArrowPathRoundedSquareIcon
          size={20}
          strokeWidth={pageNavigation === "roundTrip" ? 3 : 2}
          color={pageNavigation === "oneWay" ? "#12B3A8" : "gray"}
        />
        <Text
          className={`text-xl pl-2 ${
            pageNavigation === "roundTrip" ? "text-[#12B3A8]" : "text-gray-500"
          }`}
          style={{
            fontWeight: pageNavigation === "roundTrip" ? "700" : "500",
          }}
        >
          Round Trip
        </Text>
      </View>
    </Pressable>
  </View>
);

export default function HomeScreen() {
  const [isPending, setIsPending] = useState(false);
  const [pageNavigation, setPageNavigation] = useState("oneWay");

  const handleNavigationChange = (type: string) => setPageNavigation(type);
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
      <View className="w-full px-4 -mt-32 mx-4">
        <View className="bg-white rounded-3xl pt-2 pb-4 shadow-md shadow-gray-300">
          <View className="flex-row justify-between w-full px-4 py-2">
            <TripOption
              pageNavigation={pageNavigation}
              handleNavigationChange={handleNavigationChange}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
