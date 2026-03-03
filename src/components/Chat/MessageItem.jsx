import { Bot, User } from "lucide-react";

export const MessageItem = ({ message }) => {
  const isAi = message.role === "ai";

  return (
    <div className={`flex gap-4 mb-8 ${!isAi ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
          isAi
            ? "bg-federal-blue border border-duke-blue/50 text-white"
            : "bg-cool-gray-2/20 border border-white/10 text-white"
        }`}
      >
        {isAi ? <Bot size={22} /> : <User size={22} />}
      </div>

      <div className={`flex flex-col max-w-[80%] ${!isAi ? "items-end" : ""}`}>
        <div
        
          className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
            isAi
              ? "bg-oxford-blue/40 border border-white/5 text-cool-gray"
              : "bg-duke-blue text-white"
          }`}
        >
          {message.content}
        </div>
        <span className="text-[10px] uppercase tracking-widest mt-2 text-cool-gray-2 opacity-50">
          {isAi ? "Sinux Engine" : "You"} • {message.timestamp}
        </span>
      </div>
    </div>
  );
};
