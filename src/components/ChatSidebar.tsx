import { Plus, MessageSquare, PanelLeftClose, PanelLeft, Pin, Download, Moon, Sun, Share2, Trash2, Settings, LogIn } from "lucide-react";
import { useState, useEffect } from "react";

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  pinned?: boolean;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  isOpen: boolean;
  onToggle: () => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
  onShare: (id: string) => void;
  onSettingsOpen: () => void;
  onLoginOpen: () => void;
  userName?: string;
}

const ChatSidebar = ({ sessions, activeId, onSelect, onNew, isOpen, onToggle, onPin, onDelete, onDownload, onShare, onSettingsOpen, onLoginOpen, userName }: ChatSidebarProps) => {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    // Sync on mount
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const pinned = sessions.filter((s) => s.pinned);
  const unpinned = sessions.filter((s) => !s.pinned);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-30 md:hidden" onClick={onToggle} />
      )}

      {!isOpen && (
        <button
          onClick={onToggle}
          className="hidden md:flex fixed top-4 left-4 z-20 p-2 rounded-xl bg-card border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-all shadow-sm"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
      )}

      <aside
        className={`fixed md:relative z-40 h-full flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full md:translate-x-0"
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 shrink-0">
          <h2 className="font-semibold text-sm text-sidebar-foreground">Chats</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground transition-colors"
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground transition-colors"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* New chat */}
        <div className="px-3 pb-3 shrink-0">
          <button
            onClick={onNew}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border text-sidebar-foreground font-medium text-sm transition-all hover:bg-sidebar-accent"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Sessions */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-3 space-y-0.5">
          {pinned.length > 0 && (
            <>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 pt-2 pb-1">Pinned</p>
              {pinned.map((s) => (
                <SessionItem key={s.id} session={s} active={s.id === activeId} onSelect={onSelect} onPin={onPin} onDelete={onDelete} onDownload={onDownload} onShare={onShare} />
              ))}
            </>
          )}

          {unpinned.length > 0 && (
            <>
              {pinned.length > 0 && (
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 pt-3 pb-1">Recent</p>
              )}
              {unpinned.map((s) => (
                <SessionItem key={s.id} session={s} active={s.id === activeId} onSelect={onSelect} onPin={onPin} onDelete={onDelete} onDownload={onDownload} onShare={onShare} />
              ))}
            </>
          )}
        </div>

        {/* Bottom */}
        <div className="p-3 border-t border-sidebar-border shrink-0 space-y-1.5">
          <button
            onClick={onSettingsOpen}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>

          {userName ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sidebar-accent">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">{userName[0].toUpperCase()}</span>
              </div>
              <span className="text-sm font-medium text-sidebar-foreground truncate">{userName}</span>
            </div>
          ) : (
            <button
              onClick={onLoginOpen}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login / Sign Up
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

function SessionItem({
  session: s,
  active,
  onSelect,
  onPin,
  onDelete,
  onDownload,
  onShare,
}: {
  session: ChatSession;
  active: boolean;
  onSelect: (id: string) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
  onShare: (id: string) => void;
}) {
  return (
    <div
      className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
        active
          ? "bg-sidebar-accent text-sidebar-foreground font-medium"
          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
      }`}
      onClick={() => onSelect(s.id)}
    >
      <MessageSquare className="w-4 h-4 shrink-0" />
      <span className="truncate flex-1">{s.title}</span>
      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={(e) => { e.stopPropagation(); onPin(s.id); }} className={`p-1 rounded hover:bg-primary/10 ${s.pinned ? "text-primary" : ""}`} title={s.pinned ? "Unpin" : "Pin"}>
          <Pin className="w-3 h-3" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onShare(s.id); }} className="p-1 rounded hover:bg-primary/10" title="Share">
          <Share2 className="w-3 h-3" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDownload(s.id); }} className="p-1 rounded hover:bg-primary/10" title="Download">
          <Download className="w-3 h-3" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(s.id); }} className="p-1 rounded hover:bg-destructive/10 text-destructive" title="Delete">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export default ChatSidebar;
