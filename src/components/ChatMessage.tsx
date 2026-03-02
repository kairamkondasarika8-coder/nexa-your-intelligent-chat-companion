import { FileText, File } from "lucide-react";
import ReactMarkdown from "react-markdown";

export interface Attachment {
  type: "image" | "video" | "file";
  name: string;
  url: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
  timestamp: Date;
}

const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""} ${
        isUser ? "animate-slide-in-right" : "animate-slide-in-left"
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? "bg-primary/20" : "bg-secondary"
        }`}
      >
        {isUser ? (
          <span className="text-primary text-xs font-semibold">U</span>
        ) : (
          <span className="gradient-text font-display font-bold text-sm">N</span>
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] space-y-2`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-user-bubble rounded-tr-md text-foreground"
              : "bg-ai-bubble rounded-tl-md text-foreground"
          }`}
        >
          <div className="prose prose-sm prose-invert max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>

        {/* Attachments */}
        {message.attachments?.map((att, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-border">
            {att.type === "image" && (
              <img src={att.url} alt={att.name} className="max-w-full max-h-60 object-cover rounded-xl" />
            )}
            {att.type === "video" && (
              <video src={att.url} controls className="max-w-full max-h-60 rounded-xl" />
            )}
            {att.type === "file" && (
              <div className="flex items-center gap-3 p-3 bg-secondary/50">
                {att.name.endsWith(".pdf") ? (
                  <FileText className="w-5 h-5 text-primary" />
                ) : (
                  <File className="w-5 h-5 text-primary" />
                )}
                <span className="text-sm text-foreground truncate">{att.name}</span>
              </div>
            )}
          </div>
        ))}

        <span className="text-[10px] text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
