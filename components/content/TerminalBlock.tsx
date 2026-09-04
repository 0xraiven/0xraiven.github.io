"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal, Copy, Check, RotateCcw, Play, ChevronRight, CornerDownLeft } from "lucide-react";

export interface TerminalCommand {
  cmd: string;
  output?: string;
}

export interface TerminalPreset {
  label: string;
  cmd: string;
  output: string;
}

export interface TerminalBlockProps {
  title?: string;
  commands?: TerminalCommand[];
  presets?: TerminalPreset[];
  interactive?: boolean;
  className?: string;
}

const DEFAULT_PRESETS: TerminalPreset[] = [
  {
    label: "r41n.conf",
    cmd: "cat /etc/profile/r41n.conf",
    output: `handle      :: r41n
focus       :: Offensive Security
               Red Team Tooling
               Cloud Security
               Detection Engineering

environment :: Linux (Arch / Debian)
               Windows Active Directory
               AWS / Cloud Security
               Docker / Podman Containers
               KVM / Proxmox Virtualization

status      :: building
               breaking
               documenting`,
  },
  {
    label: "neofetch",
    cmd: "neofetch --telemetry",
    output: `        /\\_/\\          r41n@0xraiven
       ( o.o )         ----------------
        > ^ <          OS: Arch Linux x86_64
   0xraiven::ops       Host: Homelab Proxmox VE 8.2 (Self-Hosted)
                       Kernel: 6.10.10-hardened-x86_64
                       Uptime: 42 days, 13 hours, 37 mins
                       Shell: zsh 5.9 (x86_64-pc-linux-gnu)
                       Terminal: alacritty + tmux
                       Editor: Neovim (lua-hardened)
                       Focus: Offensive Security // Red Team Tooling
                       Status: Active Research (Detection & AD)
                       Memory: 3.4GiB / 64.0GiB (5%)`,
  },
  {
    label: "arsenal",
    cmd: "cat /etc/security/arsenal.conf",
    output: `[+] OFFENSIVE TOOLING  :: Burp Suite Pro, Metasploit, Impacket, BloodHound, CrackMapExec, Chisel
[+] CLOUD & INFRA      :: AWS IAM Scoping, Terraform, Docker, Podman, Proxmox, WireGuard
[+] DETECTION & BLUE   :: Wazuh SIEM, auditd, Sysmon, Zeek, Suricata, Sigma Rules
[+] SYSTEMS & LANGS    :: Python, Go, Bash, TypeScript, C/C++ (Linux Internals)`,
  },
  {
    label: "whoami",
    cmd: "whoami --all",
    output: `uid=1000(r41n) gid=1000(offensive-sec) groups=1000(offensive-sec),27(sudo),998(wheel),999(docker),1001(redteam)
identity   :: r41n (Neil)
profile    :: https://github.com/0xraiven
pgp-id     :: 0x4A1F9B3C2D8E00FA
clearance  :: LEVEL-4 RESEARCH OPERATOR`,
  },
  {
    label: "help",
    cmd: "help",
    output: `Available commands:
  cat /etc/profile      - View operator configuration & technical focus
  neofetch              - Display system specs, homelab & telemetry
  cat /etc/arsenal      - View security toolchain & technical arsenal
  whoami                - Display active user identity & clearance
  ls                    - List directories & files
  uptime                - Print homelab cluster uptime
  clear                 - Reset terminal session
  help                  - Show this manual`,
  },
];

function FormattedOutputLine({ line }: { line: string }) {
  if (line.trim().startsWith("#")) {
    return <span className="text-text-secondary/60 italic">{line}</span>;
  }

  if (line.includes("::")) {
    const parts = line.split("::");
    const key = parts[0];
    const val = parts.slice(1).join("::");
    return (
      <span>
        <span className="text-text-primary font-semibold">{key}</span>
        <span className="text-accent font-bold select-none">::</span>
        <span className="text-text-secondary">{val}</span>
      </span>
    );
  }

  if (line.trim().startsWith("[+]")) {
    return (
      <span>
        <span className="text-emerald-400 font-bold select-none">[+]</span>
        <span className="text-text-primary">{line.replace("[+]", "")}</span>
      </span>
    );
  }

  if (line.trim().startsWith("[-]")) {
    return (
      <span>
        <span className="text-accent font-bold select-none">[-]</span>
        <span className="text-text-secondary">{line.replace("[-]", "")}</span>
      </span>
    );
  }

  return <span>{line}</span>;
}

export function TerminalBlock({
  title = "r41n.conf — /etc/profile",
  commands,
  presets,
  interactive = false,
  className = "",
}: TerminalBlockProps) {
  const activePresets = presets || DEFAULT_PRESETS;
  const initialCommandList = commands || [
    {
      cmd: activePresets[0]?.cmd || "cat /etc/profile/r41n.conf",
      output: activePresets[0]?.output || "",
    },
  ];

  const [sessionCommands, setSessionCommands] = useState<TerminalCommand[]>(initialCommandList);
  const [activePreset, setActivePreset] = useState<string>(activePresets[0]?.label || "");
  const [inputVal, setInputVal] = useState("");
  const [copied, setCopied] = useState(false);
  const terminalScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync if commands prop changes externally
  useEffect(() => {
    if (commands && commands.length > 0) {
      setSessionCommands(commands);
    }
  }, [commands]);

  const handleCopy = async () => {
    try {
      const copyText = sessionCommands
        .map((c) => `$ ${c.cmd}\n${c.output || ""}`)
        .join("\n\n");
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const executeCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    if (cmd.toLowerCase() === "clear" || cmd.toLowerCase() === "cls") {
      setSessionCommands([]);
      setActivePreset("");
      return;
    }

    const lower = cmd.toLowerCase();
    let output = "";

    if (lower.includes("profile") || lower.includes("r41n.conf")) {
      const p = activePresets.find((x) => x.label === "r41n.conf");
      output = p ? p.output : DEFAULT_PRESETS[0].output;
      setActivePreset("r41n.conf");
    } else if (lower.includes("neofetch") || lower.includes("sysinfo")) {
      const p = activePresets.find((x) => x.label === "neofetch");
      output = p ? p.output : DEFAULT_PRESETS[1].output;
      setActivePreset("neofetch");
    } else if (lower.includes("arsenal") || lower.includes("tools") || lower.includes("stack")) {
      const p = activePresets.find((x) => x.label === "arsenal");
      output = p ? p.output : DEFAULT_PRESETS[2].output;
      setActivePreset("arsenal");
    } else if (lower.includes("whoami") || lower.includes("id")) {
      const p = activePresets.find((x) => x.label === "whoami");
      output = p ? p.output : DEFAULT_PRESETS[3].output;
      setActivePreset("whoami");
    } else if (lower === "ls" || lower === "dir") {
      output = `drwxr-xr-x  r41n  staff   4096 Sep 04 23:40 projects/
drwxr-xr-x  r41n  staff   4096 Sep 04 23:40 writeups/
drwxr-xr-x  r41n  staff   4096 Sep 04 23:40 notes/
drwxr-xr-x  r41n  staff   4096 Sep 04 23:40 research/
-rw-r--r--  r41n  staff   1024 Sep 04 23:40 r41n.conf
-rw-r--r--  r41n  staff   2048 Sep 04 23:40 README.md`;
      setActivePreset("");
    } else if (lower.includes("uptime")) {
      output = `23:45:00 up 42 days, 13:37,  1 user,  load average: 0.08, 0.04, 0.01`;
      setActivePreset("");
    } else if (lower.includes("uname")) {
      output = `Linux cyber-range 6.10.10-hardened-x86_64 #1 SMP PREEMPT_DYNAMIC GNU/Linux`;
      setActivePreset("");
    } else if (lower === "help") {
      const p = activePresets.find((x) => x.label === "help");
      output = p ? p.output : DEFAULT_PRESETS[4].output;
      setActivePreset("help");
    } else {
      output = `zsh: command not found: ${cmd}\nType 'help' to inspect available system commands.`;
      setActivePreset("");
    }

    setSessionCommands((prev) => [...prev, { cmd, output }]);

    // Auto-scroll terminal to bottom
    setTimeout(() => {
      if (terminalScrollRef.current) {
        terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
      }
    }, 50);
  };

  const handleRunPreset = (preset: TerminalPreset) => {
    setActivePreset(preset.label);
    setSessionCommands([{ cmd: preset.cmd, output: preset.output }]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleReset = () => {
    setActivePreset(activePresets[0]?.label || "");
    setSessionCommands([
      {
        cmd: activePresets[0]?.cmd || "cat /etc/profile/r41n.conf",
        output: activePresets[0]?.output || "",
      },
    ]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    executeCommand(inputVal);
    setInputVal("");
  };

  return (
    <div
      className={`rounded-lg border border-border bg-surface/95 overflow-hidden text-xs font-mono shadow-xl shadow-black/20 my-4 transition-all duration-200 ${className}`}
    >
      {/* Reimagined Cyberpunk Terminal Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-3.5 py-2.5 border-b border-border bg-surface-2/80 select-none gap-2">
        {/* Left: Window Controls + Path Title */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span
              onClick={handleReset}
              className="w-3 h-3 rounded-full bg-[#ff5f56]/90 inline-block cursor-pointer hover:opacity-80 transition-opacity"
              title="Reset terminal"
            />
            <span
              className="w-3 h-3 rounded-full bg-[#ffbd2e]/90 inline-block cursor-pointer hover:opacity-80 transition-opacity"
              title="Minimize"
            />
            <span
              onClick={() => {
                if (inputRef.current) inputRef.current.focus();
              }}
              className="w-3 h-3 rounded-full bg-[#27c93f]/90 inline-block cursor-pointer hover:opacity-80 transition-opacity"
              title="Focus prompt"
            />
          </div>

          <div className="flex items-center gap-1.5 text-text-secondary ml-1.5">
            <Terminal className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="font-semibold text-text-primary tracking-tight truncate max-w-[180px] sm:max-w-[280px]">
              {title}
            </span>
          </div>
        </div>

        {/* Right: Telemetry Badges + Copy Action */}
        <div className="flex items-center gap-2 text-[10px]">
          <div className="hidden sm:flex items-center gap-1.5 text-text-secondary">
            <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-[9px] uppercase tracking-wider font-semibold text-text-secondary">
              TTY1
            </span>
            <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-[9px] uppercase tracking-wider font-semibold text-accent">
              ZSH 5.9
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy terminal buffer"
            className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-text-primary px-2 py-0.5 rounded border border-border bg-surface hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div
        ref={terminalScrollRef}
        className="p-4 sm:p-5 space-y-4 max-h-[440px] overflow-y-auto terminal-scrollbar select-text bg-[#0a0b10] dark:bg-[#07080c] text-[#e1e4ea]"
      >
        {sessionCommands.map((item, idx) => (
          <div key={idx} className="space-y-2">
            {/* Prompt execution line */}
            <div className="flex items-start gap-2">
              <span className="text-accent font-bold select-none shrink-0 font-mono">
                r41n@0xraiven:~$
              </span>
              <span className="font-medium text-white whitespace-pre font-mono">
                {item.cmd}
              </span>
            </div>

            {/* Formatted output stream */}
            {item.output && (
              <pre className="text-text-secondary whitespace-pre-wrap pl-3 sm:pl-4 leading-relaxed border-l-2 border-accent/40 font-mono text-xs overflow-x-auto">
                {item.output.split("\n").map((line, lineIdx) => (
                  <div key={lineIdx}>
                    <FormattedOutputLine line={line} />
                  </div>
                ))}
              </pre>
            )}
          </div>
        ))}

        {/* Live Interactive Prompt */}
        {interactive && (
          <form
            onSubmit={handleFormSubmit}
            className="flex items-center gap-2 pt-1 font-mono text-xs"
          >
            <span className="text-accent font-bold select-none shrink-0">
              r41n@0xraiven:~$
            </span>
            <div className="relative flex-1 flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="type command (e.g. 'neofetch', 'whoami', 'help')..."
                className="w-full bg-transparent text-white outline-none font-mono text-xs placeholder:text-text-secondary/40 caret-accent"
              />
            </div>
            <button
              type="submit"
              disabled={!inputVal.trim()}
              aria-label="Run command"
              className="p-1 rounded bg-surface border border-border text-text-secondary hover:text-accent hover:border-accent/40 disabled:opacity-30 transition-colors"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Blinking block cursor when not in custom input mode */}
        {!interactive && (
          <div className="flex items-center gap-1 pt-1 font-mono">
            <span className="text-accent font-bold select-none shrink-0">
              r41n@0xraiven:~$
            </span>
            <span className="inline-block w-2 h-3.5 bg-accent animate-pulse" />
          </div>
        )}
      </div>

      {/* Interactive Quick-Run Preset Bar */}
      {interactive && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 border-t border-border bg-surface-2/60 text-[11px] font-mono">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-text-secondary/70 text-[10px] uppercase tracking-wider mr-1 hidden sm:inline">
              Quick Run:
            </span>
            {activePresets.map((preset) => {
              const isSelected = activePreset === preset.label;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleRunPreset(preset)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border transition-all ${isSelected
                    ? "bg-accent/15 border-accent/60 text-accent font-semibold shadow-xs"
                    : "border-border bg-surface hover:bg-surface-2 text-text-secondary hover:text-text-primary"
                    }`}
                >
                  <span className="text-accent select-none font-bold text-[10px]">&gt;</span>
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleReset}
            title="Reset to default config"
            className="flex items-center gap-1 text-[10px] text-text-secondary hover:text-accent p-1 rounded hover:bg-surface transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      )}
    </div>
  );
}
