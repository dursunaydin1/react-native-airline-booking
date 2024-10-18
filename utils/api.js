import axios from "axios";

export const apiToken = "jtqaZi4Mn89P8TJBbpqCrveN3EVu";
export const baseUrl = "https://test.api.amadeus.com/v2/shopping/flight-offers";

const clientId = "lmzhfnN0VHQU66ht58ZMEI6aC13MxrF5";
const clientSecret = "xisiAPU6IMCmKjVW";

let newApiToken = "";

const getNewApiToken = async () => {
  try {
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    newApiToken = response.data.access_token;
    console.log("newApiToken", newApiToken);
  } catch (error) {
    console.log(error);
  }
};

getNewApiToken();
