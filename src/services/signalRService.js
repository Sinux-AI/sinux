import * as signalR from "@microsoft/signalr";

class SignalRService {
  constructor() {
    this.connection = null;
    this.callbacks = {
      ReceiveSystemMessage: [],
      ReceiveThought: [],
      ReceiveAIResponse: []
    };
  }

  async startConnection() {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const hubUrl = `${serverUrl}/hubs/chat`;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.on("ReceiveSystemMessage", (message) => {
      this.callbacks.ReceiveSystemMessage.forEach(cb => cb(message));
    });

    this.connection.on("ReceiveThought", (agent, thought) => {
      this.callbacks.ReceiveThought.forEach(cb => cb(agent, thought));
    });

    this.connection.on("ReceiveAIResponse", (response) => {
      this.callbacks.ReceiveAIResponse.forEach(cb => cb(response));
    });

    try {
      await this.connection.start();
      console.log("SignalR Connected.");
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  async subscribe(chatLogId) {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke("SubscribeToChatLog", chatLogId);
    }
  }

  async unsubscribe(chatLogId) {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke("UnsubscribeFromChatLog", chatLogId);
    }
  }

  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
    return () => {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    };
  }
}

const signalRService = new SignalRService();
export default signalRService;
