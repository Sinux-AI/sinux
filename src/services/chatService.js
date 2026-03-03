/*
This will be related to basic chatbot functionality and interacting with anthing involving the chatbot
*/

import { useAuthStore } from "../authentication/authStore";
import { sinuxApi } from "./api.config";
import { LoginAsync } from "./authService";

// need to make models / dtos
export let GenAIChatAsync = async ({ prompt, model }) => {
  // THIS IS FOR NOW ******************************************

  try {
    const { email, displayName } = useAuthStore.getState();

    const response = await sinuxApi.get("/Prompts/generate", {
      params: { prompt, model },
    });

    console.log(response.data.message);
    return response.data.message;
  } catch (error) {
    return (
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred"
    );
  }
};
