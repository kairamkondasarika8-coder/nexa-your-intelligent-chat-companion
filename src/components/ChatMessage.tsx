import { FileText, File, Bot, User } from "lucide-react";
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
    <div className="message-appear">
      <div
        className={`flex gap-4 px-4 py-5 rounded-2xl transition-colors ${
          isUser ? "bg-transparent" : "bg-secondary/50"
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary border border-border text-foreground"
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <span className="text-xs font-medium text-muted-foreground">
            {isUser ? "You" : "Nexa"}
          </span>

          <div className="prose-chat text-foreground">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>

          {/* Attachments */}
          {message.attachments?.map((att, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-border mt-2">
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

          <span className="text-[10px] text-muted-foreground/60 block">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
