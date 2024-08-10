import cron from "node-cron";
import axios from "axios";
const makeRequestToServer = (SERVER_BASE_URL, limit) => {
  axios
    .get(SERVER_BASE_URL)
    .then((res) => console.log("Result: ", res.status))
    .catch((err) => {
      console.error("Error: (Make Request to Server)", err.status);
      // Recursively ping if failed
      if (limit == 0) return;
      makeRequestToServer(SERVER_BASE_URL, limit - 1);
    });
};

// Background Service
export const preventServerSleep = () => {
  console.log("Scheduling the Task");
  const SERVER_BASE_URL = process.env["SERVER_BASE_URL"];
  if (!SERVER_BASE_URL) {
    throw new Error("SERVER_BASE_URL not Defined");
  }

  // Ping the server
  cron.schedule("*/10 * * * *", () => {
    // Making a request to itself or the server
    makeRequestToServer(SERVER_BASE_URL, 3);
  });
};
