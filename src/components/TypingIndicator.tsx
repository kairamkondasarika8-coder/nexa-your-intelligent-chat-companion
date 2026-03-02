import { Bot } from "lucide-react";

const TypingIndicator = () => (
  <div className="message-appear">
    <div className="flex gap-4 px-4 py-5 rounded-2xl bg-secondary/50">
      <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4 text-foreground" />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Nexa</span>
        <div className="flex gap-1.5 items-center h-5">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  </div>
);

export default TypingIndicator;
