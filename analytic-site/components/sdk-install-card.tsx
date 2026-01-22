"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown } from "lucide-react";

const SDK_NAME = "nexus-avail";
const PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;

type PackageManager = (typeof PACKAGE_MANAGERS)[number];

const getInstallCommand = (pm: PackageManager): string => {
  switch (pm) {
    case "npm":
      return `npm install ${SDK_NAME}`;
    case "pnpm":
      return `pnpm add ${SDK_NAME}`;
    case "yarn":
      return `yarn add ${SDK_NAME}`;
    case "bun":
      return `bun add ${SDK_NAME}`;
  }
};

export function SdkInstallCard() {
  const [selectedPm, setSelectedPm] = useState<PackageManager>("npm");
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const installCommand = getInstallCommand(selectedPm);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative group">
      {/* Install Command Box */}
      <div className="bg-secondary rounded-lg p-4 font-mono text-sm text-primary flex items-center justify-between border border-border/30">
        <code className="overflow-x-auto flex-1">{installCommand}</code>
        <div className="flex gap-2 items-center ml-4 flex-shrink-0">
          {/* Package Manager Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors text-xs text-primary font-medium"
              title="Switch package manager"
            >
              {selectedPm}
              <ChevronDown className="w-3 h-3" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border/50 rounded-lg shadow-lg z-50 min-w-[100px]">
                {PACKAGE_MANAGERS.map((pm) => (
                  <button
                    key={pm}
                    onClick={() => {
                      setSelectedPm(pm);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                      selectedPm === pm
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              <Copy className="w-4 h-4 text-primary" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
