const TypingIndicator = () => (
  <div className="flex items-start gap-3 animate-fade-up">
    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
      <span className="gradient-text font-display font-bold text-sm">N</span>
    </div>
    <div className="bg-ai-bubble rounded-2xl rounded-tl-md px-4 py-3 flex gap-1.5 items-center">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  </div>
);

export default TypingIndicator;
