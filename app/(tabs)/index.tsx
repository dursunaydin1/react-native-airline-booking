import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Header from "@/components/Header";
import {
  ArrowPathRoundedSquareIcon,
  ChevronDoubleRightIcon,
} from "react-native-heroicons/outline";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiToken, baseUrl } from "@/utils/api";
import axios from "axios";

// Search Flight Form
interface SearchFlightData {
  originCity: string;
  destinationCity: string;
  departureDate: string;
  seat: number | string;
}

// Flight Offer Data
export interface FlightOfferData {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: Date;
  returnDate: Date;
  adults: number;
  maxResults: number;
}

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
// Location Components
interface LocationInputProps {
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onPress: () => void;
}

const LocationInput = ({
  placeholder,
  icon,
  value,
  onPress,
}: LocationInputProps) => (
  <View className="border-2 border-gray-300 mx-4 mb-4 rounded-2xl justify-center">
    <Pressable onPress={onPress}>
      <View className="px-4 flex-row justify-between items-center">
        <View className="w-[15%] border-r-2 border-gray-300">{icon}</View>

        <View className="w-[80%] py-3">
          {value ? (
            <Text className="bg-transparent text-gray-600 font-bold">
              {value}
            </Text>
          ) : (
            <Text className="bg-transparent text-lg text-gray-600 font-semibold">
              {placeholder}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  </View>
);

// Departure Date Components
interface DepartureDateInputProps {
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onPress: () => void;
}

const DepartureDate = ({
  placeholder,
  icon,
  value,
  onPress,
}: DepartureDateInputProps) => (
  <Pressable
    onPress={onPress}
    className="border-2 border-gray-300 mx-4 mb-4 rounded-2xl justify-center py-4 flex-row items-center pl-4 "
  >
    <View className="w-[15%] border-r-2 border-gray-300">{icon}</View>
    <View className="w-[85%] px-4 items-start justify-start">
      <Text className="bg-transparent text-gray-600 font-bold">
        {value || placeholder}
      </Text>
    </View>
  </Pressable>
);

export default function HomeScreen() {
  const [isPending, setIsPending] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [pageNavigation, setPageNavigation] = useState("oneWay");
  const [flightOffferData, setFlightOfferData] = useState<FlightOfferData>({
    originLocationCode: "",
    destinationLocationCode: "",
    departureDate: new Date(),
    returnDate: new Date(),
    adults: 1,
    maxResults: 10,
  });
  const [searchFlightData, setSearchFlightData] = useState<SearchFlightData>({
    originCity: "",
    destinationCity: "",
    departureDate: "",
    seat: 1,
  });
  const [selectedDate, setSelectedDate] = useState<any>(new Date());

  const handleNavigationChange = (type: string) => setPageNavigation(type);

  useEffect(() => {
    const loadSelectedDestination = async () => {
      try {
        const departureCities = await AsyncStorage.getItem("departureCities");
        const destinationCities = await AsyncStorage.getItem(
          "destinationCities"
        );
        const departureDate = await AsyncStorage.getItem("departureDate");

        if (departureCities !== null) {
          const departureCitiesArray = JSON.parse(departureCities);

          const lastAddedItem =
            departureCitiesArray[departureCitiesArray.length - 1];

          setSearchFlightData((prev) => ({
            ...prev,
            originCity: lastAddedItem.city,
          }));

          setFlightOfferData((prev) => ({
            ...prev,
            originLocationCode: lastAddedItem.iataCode,
          }));
        }

        if (destinationCities !== null) {
          const destinationCitiesArray = JSON.parse(destinationCities);

          const lastAddedItem =
            destinationCitiesArray[destinationCitiesArray.length - 1];

          setSearchFlightData((prev) => ({
            ...prev,
            destinationCity: lastAddedItem.city,
          }));

          setFlightOfferData((prev) => ({
            ...prev,
            destinationLocationCode: lastAddedItem.iataCode,
          }));
        }

        if (departureDate !== null) {
          setSelectedDate(departureDate);

          setSearchFlightData((prev) => ({
            ...prev,
            departureDate: departureDate,
          }));

          setFlightOfferData((prev) => ({
            ...prev,
            departureDate: new Date(departureDate),
          }));
        }
      } catch (error) {
        console.log("Error loading previous selected cities", error);
      }
    };

    loadSelectedDestination();

    setRefreshData(false);
  }, [refreshData]);

  const handleBackFromPreviousScreen = () => {
    setRefreshData(true);
  };

  useFocusEffect(
    useCallback(() => {
      handleBackFromPreviousScreen();
    }, [session])
  );

  const constructSearchUrl = () => {
    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults,
      maxResults,
    } = flightOffferData;
    const formattedDepartureDate = new Date(departureDate).toISOString();

    if (
      !originLocationCode ||
      !destinationLocationCode ||
      !departureDate ||
      !adults
    ) {
      Alert.alert("Error", "Please fill all the required fields");
    }
    return `${baseUrl}?originLocationCode=${originLocationCode}&destinationLocationCode=${destinationLocationCode}&departureDate=${formattedDepartureDate}&adults=${adults}&max=${maxResults}`;
  };

  const handleParentSearch = async () => {
    const searchUrl = constructSearchUrl();
    setIsPending(true);

    try {
      const response = await axios.get(searchUrl, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });
      if (response.data) {
        setIsPending(false);

        await AsyncStorage.setItem(
          "searchFlightData",
          JSON.stringify(searchFlightData)
        );
        console.log("Flight Ticket Data", response.data);
        router.push({
          pathname: "/searchresult" as "/",
          params: {
            flightOffferData: JSON.stringify(response.data),
          },
        });
      }
    } catch (error: any) {
      console.log("Error fetching flight offers", error);
      setIsPending(true);

      if (error.response && error.response.status === 401) {
        Alert.alert(
          "API Key Expired",
          "Please get a new API Key from OpenFlights",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("Error", "An error occurred while fetching flight offers");
      }
    }
  };

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
        <View className="bg-white rounded-3xl pt-2 pb-4 shadow-md shadow-slate-300">
          <View className="flex-row justify-between w-full px-4 py-2">
            <TripOption
              pageNavigation={pageNavigation}
              handleNavigationChange={handleNavigationChange}
            />
          </View>

          {/* Origin City */}
          <LocationInput
            placeholder={
              searchFlightData.originCity
                ? searchFlightData.originCity
                : "Departure City"
            }
            icon={
              <FontAwesome5 size={20} color="gray" name="plane-departure" />
            }
            value={searchFlightData.originCity}
            onPress={() => router.push("/departure")}
          />
          {/* Destination City */}
          <LocationInput
            placeholder={
              searchFlightData.destinationCity
                ? searchFlightData.destinationCity
                : "Destination City"
            }
            icon={<FontAwesome5 size={20} color="gray" name="plane-arrival" />}
            value={searchFlightData.destinationCity}
            onPress={() => router.push("/destination")}
          />
          {/* Departure Date */}
          <DepartureDate
            placeholder={
              selectedDate && selectedDate.length > 0
                ? selectedDate.replace(/^"|"$|"/g, "")
                : "Departure Date"
            }
            icon={<FontAwesome5 size={20} color="gray" name="calendar-alt" />}
            value={searchFlightData.departureDate.replace(/^"|"$|"/g, "")}
            onPress={() => router.push("/departuredate")}
          />

          {/* Seat */}
          <View className="border-2 border-gray-300 mx-4 rounded-2xl py-3 justify-center flex-row items-center pl-4">
            <View>
              <MaterialCommunityIcons
                name="seat-passenger"
                size={20}
                color="gray"
              />
            </View>

            <TextInput
              className="w-[85%] text-base px-4 font-semibold"
              placeholder="Seat"
              keyboardType="numeric"
              value={String(searchFlightData.seat)}
              onChangeText={(text) => {
                const seatValue = parseInt(text, 10);

                const validSeatValue = isNaN(seatValue) ? 0 : seatValue;

                setSearchFlightData((prev) => ({
                  ...prev,
                  seat: validSeatValue,
                }));

                setFlightOfferData((prev) => ({
                  ...prev,
                  adults: validSeatValue,
                }));
              }}
            />
          </View>
          {/* Search Button */}
          <View className="w-full justify-start pt-2 px-4 mt-4">
            <Pressable
              className="bg-[#12B3A8] rounded-lg justify-center items-center py-4 "
              onPress={() => handleParentSearch}
            >
              <Text className="text-white font-bold text-lg">Search</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
