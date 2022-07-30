import NodeGeocoder from "node-geocoder";
import dotEnv from "dotenv";
dotEnv.config({ path: "./config/config.env" });

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  apiKey: process.env.GEOCODER_API_KEY, // for Mapquest, OpenCage, Google Premier
  httpAdapter: "https",
  formatter: null, // 'gpx', 'string', ...
};

export const geocoder = NodeGeocoder(options);