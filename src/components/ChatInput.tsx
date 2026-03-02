import { useState, useRef, useCallback } from "react";
import { Send, Mic, MicOff, Paperclip, X, FileVideo, FileText, Wrench } from "lucide-react";
import type { Attachment } from "./ChatMessage";
import AIToolsPanel from "./AIToolsPanel";

interface ChatInputProps {
  onSend: (text: string, attachments: Attachment[]) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const processFiles = useCallback((files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      let type: Attachment["type"] = "file";
      if (file.type.startsWith("image/")) type = "image";
      else if (file.type.startsWith("video/")) type = "video";
      setAttachments((prev) => [...prev, { type, name: file.name, url }]);
    });
  }, []);

  const handleSubmit = () => {
    if ((!text.trim() && attachments.length === 0) || disabled) return;
    onSend(text.trim(), attachments);
    setText("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setText((prev) => prev + (prev ? " " : "") + transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToolSelect = (prompt: string) => {
    setText(prompt);
  };

  return (
    <div
      className={`relative bg-card border border-border rounded-2xl shadow-sm transition-all ${
        isDragOver ? "ring-2 ring-primary border-primary" : "focus-within:border-primary/50 focus-within:shadow-md"
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <div className="absolute inset-0 rounded-2xl bg-primary/5 flex items-center justify-center z-10 pointer-events-none">
          <p className="text-primary font-medium text-sm">Drop files here</p>
        </div>
      )}

      <AIToolsPanel isOpen={toolsOpen} onClose={() => setToolsOpen(false)} onSelectTool={handleToolSelect} />

      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className="flex gap-2 px-3 pt-3 flex-wrap">
          {attachments.map((att, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden bg-secondary border border-border">
              {att.type === "image" ? (
                <img src={att.url} alt="" className="w-14 h-14 object-cover" />
              ) : (
                <div className="w-14 h-14 flex flex-col items-center justify-center gap-1 p-1">
                  {att.type === "video" ? <FileVideo className="w-4 h-4 text-muted-foreground" /> : <FileText className="w-4 h-4 text-primary" />}
                  <span className="text-[7px] text-muted-foreground truncate w-full text-center">{att.name}</span>
                </div>
              )}
              <button
                onClick={() => removeAttachment(i)}
                className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-2.5 h-2.5 text-destructive-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-1 p-2">
        <button
          onClick={() => setToolsOpen(!toolsOpen)}
          className={`p-2 rounded-xl transition-colors ${toolsOpen ? "bg-primary/10 text-primary" : "hover:bg-secondary text-muted-foreground hover:text-foreground"}`}
          title="AI Tools"
        >
          <Wrench className="w-5 h-5" />
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept="image/*,video/mp4,.pdf,.doc,.docx,.txt"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Message Nexa..."
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground py-2 px-1"
          style={{ minHeight: "36px", maxHeight: "160px" }}
        />

        <button
          onClick={toggleVoice}
          className={`p-2 rounded-xl transition-all ${
            isListening
              ? "bg-destructive/10 text-destructive"
              : "hover:bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          onClick={handleSubmit}
          disabled={disabled || (!text.trim() && attachments.length === 0)}
          className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
