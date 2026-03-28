import * as signalR from "@microsoft/signalr";
import { useAuthStore } from "../authentication/authStore";

class SignalRService {
  constructor() {
    this.connection = null;
    this.callbacks = {
      // Chat
      ReceiveSystemMessage: [],
      ReceiveThought: [],
      ReceiveAIResponse: [],
      ReceiveError: [],
      // Jobs / Orchestration
      JobStatusUpdate: [],
      // User-level
      BalanceUpdated: [],
      LowBalanceAlert: [],
      PlatformNotification: [],
    };
  }

  getConnectionId() {
    return this.connection?.connectionId ?? null;
  }

  isConnected() {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  async startConnection() {
    if (this.isConnected()) return this.connection.connectionId;

    const serverUrl = import.meta.env.VITE_SERVER_HUB_URL;
    

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(serverUrl, { withCredentials: true })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    // --- Chat Session Events ---
    this.connection.on("ReceiveSystemMessage", (message) => {
      this.callbacks.ReceiveSystemMessage.forEach((cb) => cb(message));
    });

    this.connection.on("ReceiveThought", (agentName, thought) => {
      this.callbacks.ReceiveThought.forEach((cb) => cb(agentName, thought));
    });

    this.connection.on("ReceiveAIResponse", (chatLogId, content, title, promptTokens, completionTokens, cost) => {
      // Play sound if user has sounds enabled
      const prefs = useAuthStore.getState().preferences;
      if (prefs?.soundsEnabled) {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.4);
        } catch (_) {}
      }
      this.callbacks.ReceiveAIResponse.forEach((cb) =>
        cb(chatLogId, content, title, promptTokens, completionTokens, cost)
      );
    });

    this.connection.on("ReceiveError", (errorMessage) => {
      this.callbacks.ReceiveError.forEach((cb) => cb(errorMessage));
    });

    // --- Job Events ---
    this.connection.on("JobStatusUpdate", (jobId, status, processedItems, totalItems) => {
      this.callbacks.JobStatusUpdate.forEach((cb) => cb(jobId, status, processedItems, totalItems));
    });

    // --- User-level Events ---
    this.connection.on("BalanceUpdated", async (newBalance) => {
      // Fetch fresh lock state — don't trust the stale store value
      const { updateBilling } = useAuthStore.getState();
      try {
        const { getMyOrg } = await import("../services/organizationService");
        const { data: org } = await getMyOrg();
        updateBilling(newBalance, org?.isLocked ?? false);
      } catch {
        // Fallback: update balance only, keep existing lock state
        const { isLocked } = useAuthStore.getState();
        updateBilling(newBalance, isLocked);
      }
      this.callbacks.BalanceUpdated.forEach((cb) => cb(newBalance));
    });

    this.connection.on("LowBalanceAlert", (balance, threshold) => {
      this.callbacks.LowBalanceAlert.forEach((cb) => cb(balance, threshold));
    });

    this.connection.on("PlatformNotification", (type, title, body, ctaUrl) => {
      // Gate by user preferences before broadcasting
      const prefs = useAuthStore.getState().preferences;
      const allowed = {
        changelog:    prefs?.notifyChangelog,
        new_feature:  prefs?.notifyNewFeatures,
        tier_upsell:  prefs?.notifyTierUpsell,
        usage_alert:  prefs?.notifyUsageAlerts,
      }[type] ?? false;

      if (allowed) {
        this.callbacks.PlatformNotification.forEach((cb) => cb(type, title, body, ctaUrl));
      }
    });

    try {
      await this.connection.start();
      return this.connection.connectionId;
    } catch (err) {
      console.error("SignalR Connection Error:", err);
      setTimeout(() => this.startConnection(), 5000);
      return null;
    }
  }

  // --- Chat subscriptions ---
  async subscribe(chatLogId) {
    if (this.isConnected()) {
      await this.connection.invoke("SubscribeToChatLog", chatLogId);
    }
  }

  async unsubscribe(chatLogId) {
    if (this.isConnected()) {
      await this.connection.invoke("UnsubscribeFromChatLog", chatLogId);
    }
  }

  // --- Job subscriptions ---
  async subscribeToJob(jobId) {
    if (this.isConnected()) {
      await this.connection.invoke("SubscribeToJob", jobId);
    }
  }

  async unsubscribeFromJob(jobId) {
    if (this.isConnected()) {
      await this.connection.invoke("UnsubscribeFromJob", jobId);
    }
  }

  // --- User-level subscriptions ---
  async subscribeToUserEvents(userId) {
    if (this.isConnected()) {
      await this.connection.invoke("SubscribeToUserEvents", userId);
    }
  }

  async unsubscribeFromUserEvents(userId) {
    if (this.isConnected()) {
      await this.connection.invoke("UnsubscribeFromUserEvents", userId);
    }
  }

  // --- Generic event wiring ---
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
    return () => {
      if (this.callbacks[event]) {
        this.callbacks[event] = this.callbacks[event].filter((cb) => cb !== callback);
      }
    };
  }

  // --- Convenience wrappers ---
  onReceiveChunk(callback)       { return this.on("ReceiveAIResponse", callback); }
  onReceiveThought(callback)     { return this.on("ReceiveThought", callback); }
  onSystemMessage(callback)      { return this.on("ReceiveSystemMessage", callback); }
  onReceiveError(callback)       { return this.on("ReceiveError", callback); }
  onJobStatusUpdate(callback)    { return this.on("JobStatusUpdate", callback); }
  onBalanceUpdated(callback)     { return this.on("BalanceUpdated", callback); }
  onLowBalanceAlert(callback)    { return this.on("LowBalanceAlert", callback); }
  onPlatformNotification(callback) { return this.on("PlatformNotification", callback); }
}

const signalRService = new SignalRService();
export default signalRService;
