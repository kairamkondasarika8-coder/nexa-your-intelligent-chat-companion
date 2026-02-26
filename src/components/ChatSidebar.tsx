import { Plus, MessageSquare, PanelLeftClose, PanelLeft } from "lucide-react";

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ChatSidebar = ({ sessions, activeId, onSelect, onNew, isOpen, onToggle }: ChatSidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-background/60 z-30 md:hidden" onClick={onToggle} />
      )}

      {/* Toggle button when closed (desktop) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="hidden md:flex fixed top-4 left-4 z-20 p-2 rounded-xl glass hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
      )}

      <aside
        className={`fixed md:relative z-40 h-full flex flex-col bg-card border-r border-border transition-all duration-300 ${
          isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:translate-x-0"
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <h2 className="font-display font-semibold text-sm text-foreground">Chat History</h2>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* New chat */}
        <div className="p-3 shrink-0">
          <button
            onClick={onNew}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-secondary/30 transition-all text-sm text-muted-foreground hover:text-foreground"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Sessions */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-3 space-y-1">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all truncate ${
                s.id === activeId
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="truncate">{s.title}</span>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
