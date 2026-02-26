import { FileText, Bug, BookOpen, Image, Lightbulb, Languages, Share2, X } from "lucide-react";

interface AIToolsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (prompt: string) => void;
}

const tools = [
  { icon: FileText, label: "Resume Generator", emoji: "📄", prompt: "Help me create a professional resume. Ask me about my experience, skills, and education." },
  { icon: Bug, label: "Code Debugger", emoji: "🐛", prompt: "I need help debugging code. Please share the code and I'll find and fix the errors." },
  { icon: BookOpen, label: "PDF Summarizer", emoji: "📑", prompt: "Upload a PDF or paste text and I'll provide a concise summary with key points." },
  { icon: Image, label: "Image Captioner", emoji: "🖼️", prompt: "Upload an image and I'll generate a descriptive caption for it." },
  { icon: Lightbulb, label: "Idea Generator", emoji: "💡", prompt: "Tell me a topic and I'll brainstorm creative ideas for you!" },
  { icon: Languages, label: "Telugu Translator", emoji: "🌐", prompt: "I'll translate between Telugu (in English letters / Romanized) and English. Type any text to translate!" },
];

const AIToolsPanel = ({ isOpen, onClose, onSelectTool }: AIToolsPanelProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 glass rounded-2xl p-4 animate-fade-up z-20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-sm gradient-text">⚡ AI Tools</h3>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary/80 text-muted-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {tools.map((tool) => (
          <button
            key={tool.label}
            onClick={() => { onSelectTool(tool.prompt); onClose(); }}
            className="flex items-center gap-2 p-3 rounded-xl hover:bg-secondary/60 transition-all text-left group border border-transparent hover:border-primary/20"
          >
            <span className="text-lg">{tool.emoji}</span>
            <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
              {tool.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AIToolsPanel;
