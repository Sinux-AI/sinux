/*
This will be related to basic chatbot functionality and interacting with anthing involving the chatbot
*/

import { generatePath } from "react-router";
import { useAuthStore } from "../authentication/authStore";
import { sinuxApi } from "./api.config";
import { LoginAsync } from "./authService";

// need to make models / dtos
export const GenAIChatAsync = async ({ prompt, model, chatLogId }) => {
  try {
    const response = await sinuxApi.post("/Prompts/generate", {
      prompt,
      model: parseInt(model),
      chatLogId
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Uplink failure.";
    throw new Error(message);
  }
};

