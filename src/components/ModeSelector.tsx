import { GraduationCap, Code, Brain, Briefcase, MessageCircle } from "lucide-react";

export type AIMode = "general" | "study" | "coding" | "brainstorm" | "professional";

interface ModeSelectorProps {
  mode: AIMode;
  onChange: (mode: AIMode) => void;
}

const modes: { id: AIMode; label: string; icon: React.ElementType }[] = [
  { id: "general", label: "General", icon: MessageCircle },
  { id: "study", label: "Study", icon: GraduationCap },
  { id: "coding", label: "Code", icon: Code },
  { id: "brainstorm", label: "Ideas", icon: Brain },
  { id: "professional", label: "Pro", icon: Briefcase },
];

const ModeSelector = ({ mode, onChange }: ModeSelectorProps) => {
  return (
    <div className="flex gap-0.5 p-1 rounded-xl bg-secondary/50 border border-border">
      {modes.map((m) => {
        const active = mode === m.id;
        const Icon = m.icon;
        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ModeSelector;
