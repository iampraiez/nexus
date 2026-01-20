"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyableCodeProps {
  code: string;
  language?: string;
}

export function CopyableCode({ code, language = "bash" }: CopyableCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative group">
      <pre className="bg-secondary rounded-lg p-4 text-xs font-mono text-foreground overflow-x-auto pr-12">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors opacity-0 group-hover:opacity-100"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="w-4 h-4 text-primary" />
        ) : (
          <Copy className="w-4 h-4 text-primary" />
        )}
      </button>
    </div>
  );
}
