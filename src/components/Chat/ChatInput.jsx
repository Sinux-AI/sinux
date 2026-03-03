import { useState } from "react";
import { Send, Paperclip } from "lucide-react";

export const ChatInput = ({ onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Logic for sending is passed to the parent
    onSendMessage(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-duke-blue to-federal-blue rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-1000"></div>
      
      <div className="relative bg-oxford-blue border border-white/10 rounded-2xl p-2 flex items-end gap-2 focus-within:border-duke-blue/50 transition-all">
        <button type="button" className="p-3 text-cool-gray-2 hover:text-white transition-colors">
          <Paperclip size={20} />
        </button>
        
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="1"
          placeholder="Type your command..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-cool-gray-2/50 py-3 resize-none max-h-60"
        />

        <button 
          type="submit"
          className="bg-duke-blue hover:bg-navy-blue text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-duke-blue/20"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};