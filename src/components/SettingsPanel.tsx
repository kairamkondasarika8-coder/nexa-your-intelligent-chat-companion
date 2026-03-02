import { useState } from "react";
import { X, Volume2, VolumeX, Globe, Palette } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [language, setLanguage] = useState("english");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm" style={{ animation: "fade-up 0.2s ease-out" }}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-lg text-foreground">Settings</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {voiceEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
              <Label>Voice Input</Label>
            </div>
            <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Label>Auto-speak AI replies</Label>
            </div>
            <Switch checked={autoSpeak} onCheckedChange={setAutoSpeak} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-primary" />
              <Label>Language</Label>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground outline-none"
            >
              <option value="english">English</option>
              <option value="telugu">Telugu</option>
              <option value="hindi">Hindi</option>
              <option value="spanish">Spanish</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <Label>Theme accent</Label>
            </div>
            <div className="flex gap-2">
              {["hsl(217,92%,55%)", "hsl(145,70%,40%)", "hsl(258,60%,55%)", "hsl(32,95%,50%)"].map((c) => (
                <button
                  key={c}
                  className="w-6 h-6 rounded-full border-2 border-border hover:scale-110 transition-transform"
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-[10px] text-muted-foreground text-center">Nexa v1.0 • Free to use</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
