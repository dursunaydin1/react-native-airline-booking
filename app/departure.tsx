import { View, Text, Pressable, TextInput, FlatList } from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Departure() {
  const [searchInput, setSearchInput] = useState("");
  const [autoCompleteResults, setAutoCompleteResults] = useState([]);

  const handleInputChange = (text: string) => setSearchInput(text);
  return (
    <View className="flex-1 items-center bg-[#F5F7FA] relative">
      <View className="w-full h-full">
        <View
          className="justify-start border-orange-600 w-full bg-[#192031] relative pt-16 pb-8"
          style={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
        >
          <View>
            {/* Header */}
            <View className="flex-row gap-4 justify-start items-center px-2">
              <Pressable
                onPress={() => router.back()}
                className="flex-row justify-center items-center h-14 w-[20%]"
              >
                <View className="rounded-full items-center justify-center bg-gray-500 h-10 w-10">
                  <MaterialIcons
                    name="keyboard-arrow-left"
                    size={30}
                    color={"#fff"}
                  />
                </View>
              </Pressable>
              <View className="w-[60%] justify-center items-center flex-row">
                <Text className="text-white  font-extrabold text-lg">
                  Select Departure
                </Text>
              </View>

              <View>
                <View>
                  <MaterialCommunityIcons
                    name="dots-horizontal"
                    size={30}
                    color="white"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Airport or City Search  */}
        <View className="w-full py-4 px-4 relative">
          <View className="flex-row justify-between items-center bg-white border-2 border-gray-400 rounded-xl h-14 overflow-hidden">
            <View className="w-full h-full justify-center">
              <TextInput
                placeholder="Search for an airport or city"
                placeholderTextColor={"gray"}
                value={searchInput}
                onChangeText={handleInputChange}
                className="bg-transparent text-gray-600 h-full px-2 capitalize"
              />
            </View>
          </View>

          {/* AutoComplete Results */}
          {autoCompleteResults.length > 0 && (
            <View className="border-2 border-gray-400 bg-white rounded-xl shadow-md mt-4">
              <FlatList
                data={autoCompleteResults}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {}}
                    className="px-2 py-2 rounded-xl my-1"
                  >
                    <Text className="text-gray-500 capitalize">
                      {item.name} ({item.iataCode})
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
