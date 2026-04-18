import { Bot, User, Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export const MessageItem = ({ message, onEdit }) => {
  const isAi = message.role === "ai" || message.role === "assistant" || message.role === "system";
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleSave = () => {
    if (onEdit && editContent !== message.content) {
      onEdit(message.id, editContent);
    }
    setIsEditing(false);
  };

  return (
    <div className={`flex gap-4 mb-6 group animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards ${!isAi ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border transition-all duration-500 active:scale-90 ${
          isAi
            ? "bg-primary/5 border-primary/20 text-primary"
            : "bg-surface border-border-glow text-text-primary"
        }`}
      >
        {isAi ? <Bot size={20} strokeWidth={1.5} /> : <User size={20} strokeWidth={1.5} />}
      </div>

      <div className={`flex flex-col max-w-[85%] ${!isAi ? "items-end text-right" : "text-left"}`}>
        <div
          className={`relative p-4 md:p-5 text-[15px] leading-relaxed shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all duration-700 ${
            isAi
              ? "rounded-2xl rounded-tl-none bg-surface border border-border-glow text-text-primary font-medium"
              : "rounded-2xl rounded-tr-none bg-primary text-white shadow-neon-primary font-semibold tracking-tight"
          }`}
        >
          {isEditing ? (
            <div className="flex flex-col gap-4 w-full min-w-[280px] md:min-w-[400px]">
               <textarea 
                className="w-full bg-text-primary/[0.03] text-text-primary rounded-2xl p-4 outline-none border border-border-glow text-[14px] font-medium min-h-[120px] focus:border-primary/40 focus:bg-surface transition-all shadow-inner resize-none leading-relaxed"
                value={editContent} onChange={e => setEditContent(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary/40 hover:text-text-primary hover:bg-text-primary/5 transition-all active:scale-95">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] bg-text-primary text-background hover:brightness-110 transition-all flex items-center gap-2 active:scale-95 shadow-xl"><Check size={12}/> Save Changes</button>
              </div>
            </div>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  table: ({ ...props }) => (
                    <div className="overflow-x-auto my-4 rounded-xl border border-border-glow">
                      <table className="min-w-full divide-y divide-border-glow" {...props} />
                    </div>
                  ),
                  thead: ({ ...props }) => <thead className="bg-text-primary/5" {...props} />,
                  th: ({ ...props }) => <th className="px-4 py-2 text-left text-[11px] font-black uppercase tracking-widest text-text-secondary/60" {...props} />,
                  td: ({ ...props }) => <td className="px-4 py-2 text-sm border-t border-border-glow/30" {...props} />,
                  code: ({ inline, ...props }) => 
                    inline ? (
                      <code className="bg-text-primary/5 px-1.5 py-0.5 rounded-md font-mono text-sm text-primary" {...props} />
                    ) : (
                      <code className="block bg-black/40 p-4 rounded-xl font-mono text-sm overflow-x-auto border border-border-glow/50 my-4" {...props} />
                    ),
                  ul: ({ ...props }) => <ul className="list-disc list-inside space-y-1 mb-4" {...props} />,
                  ol: ({ ...props }) => <ol className="list-decimal list-inside space-y-1 mb-4" {...props} />,
                  li: ({ ...props }) => <li className="text-[15px]" {...props} />,
                  h1: ({ ...props }) => <h1 className="text-xl font-black mb-4 uppercase tracking-tight" {...props} />,
                  h2: ({ ...props }) => <h2 className="text-lg font-black mb-3 uppercase tracking-tight" {...props} />,
                  h3: ({ ...props }) => <h3 className="text-base font-black mb-2 uppercase tracking-tight" {...props} />,
                  p: ({ ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                  a: ({ ...props }) => <a className="text-primary hover:underline" {...props} />,
                }}
              >
                {message.content}
              </ReactMarkdown>
              {!isAi && onEdit && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="absolute -left-12 top-4 opacity-0 group-hover:opacity-100 p-3 rounded-2xl hover:bg-text-primary/10 text-text-secondary/20 hover:text-text-primary transition-all active:scale-90 border border-transparent hover:border-border-glow"
                >
                  <Edit2 size={14} />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 mt-2 px-2">
           <div className={`w-1.5 h-1.5 rounded-full ${isAi ? 'bg-primary' : 'bg-primary/40'}`} />
           <span className="text-[10px] uppercase font-black tracking-[0.3em] text-text-secondary/30">
             {isAi ? "Sinux Assistant" : "User"} • {message.timestamp}
           </span>
        </div>
      </div>
    </div>
  );
};
