const { CHECKER_URL } = require("./constants");

exports.connectModelBackend = async function () {
  const URI = CHECKER_URL;

  try {
    // Create a GET request to the model backend
    const response = await fetch(URI, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the response contains any data
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text(); // Get the response as plain text

    // Check if there is a response body and try parsing it
    if (text) {
      const data = JSON.parse(text);
      console.log("Connected to the model backend: ", data);
    } else {
      console.log("No response body from the model backend.");
    }
  } catch (error) {
    console.error("Error connecting to the model backend:", error);
  }
};
