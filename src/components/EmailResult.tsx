import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface EmailResultProps {
  summary: string;
  suggestedResponse: string;
}

const EmailResult = ({ summary, suggestedResponse }: EmailResultProps) => {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  const handleCopy = async (text: string, type: "summary" | "response") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "summary") {
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 2000);
      } else {
        setCopiedResponse(true);
        setTimeout(() => setCopiedResponse(false), 2000);
      }
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display text-foreground">Email Summary</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(summary, "summary")}
            className="text-muted-foreground"
          >
            {copiedSummary ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copiedSummary ? "Copied" : "Copy"}
          </Button>
        </div>
        <p className="text-foreground/90 font-body leading-relaxed text-[15px]">
          {summary}
        </p>
      </section>

      {/* Suggested Response */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display text-foreground">Suggested Response</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(suggestedResponse, "response")}
            className="text-muted-foreground"
          >
            {copiedResponse ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copiedResponse ? "Copied" : "Copy"}
          </Button>
        </div>
        <div className="text-foreground/90 font-body leading-relaxed text-[15px] whitespace-pre-wrap">
          {suggestedResponse}
        </div>
      </section>
    </div>
  );
};

export default EmailResult;
