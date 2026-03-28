import React from "react";
import { useAuthStore } from "./authStore";
import AuthRequiredModal from "../components/ui/AuthRequiredModal";
import { Loader } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const userId = useAuthStore((s) => s.userId);

  if (!isInitialized) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-full">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/10" />
          <div className="space-y-2 text-center">
            <div className="h-3 w-40 bg-white/5 rounded-full mx-auto" />
            <div className="h-2 w-24 bg-white/5 rounded-full mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!isInitialized) return <Loader />;

  if (!userId) return <AuthRequiredModal />;

  return children;
};

export default ProtectedRoute;
