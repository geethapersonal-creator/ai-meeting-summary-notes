import { useState, useRef } from "react";
import { streamSummary } from "@/lib/stream-summary";
import { FileText, Sparkles, Loader2, ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SummaryDisplay from "@/components/SummaryDisplay";

const Index = () => {
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSummarize = async () => {
    if (!notes.trim()) {
      toast.error("Please paste your meeting notes first.");
      return;
    }

    setIsLoading(true);
    setSummary("");

    let accumulated = "";

    try {
      await streamSummary({
        notes: notes.trim(),
        onDelta: (chunk) => {
          accumulated += chunk;
          setSummary(accumulated);
        },
        onDone: () => setIsLoading(false),
        onError: (err) => {
          toast.error(err);
          setIsLoading(false);
        },
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setNotes(text);
      toast.success("Pasted from clipboard!");
    } catch {
      toast.error("Unable to read clipboard.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-4xl py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display tracking-tight text-foreground">
                Meeting Notes Summarizer
              </h1>
              <p className="text-sm text-muted-foreground font-body">
                Paste your notes, get structured insights instantly
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl py-10 space-y-8">
        {/* Input Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="notes"
              className="text-sm font-semibold text-foreground font-body uppercase tracking-wider"
            >
              Meeting Notes
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePaste}
              className="text-muted-foreground"
            >
              <ClipboardPaste className="h-4 w-4" />
              Paste
            </Button>
          </div>
          <textarea
            ref={textareaRef}
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your meeting notes, transcript, or raw discussion points here..."
            className="w-full min-h-[240px] rounded-xl border border-border bg-card p-5 text-foreground font-body text-[15px] leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/30 resize-y transition-shadow"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-body">
              {notes.length > 0 ? `${notes.split(/\s+/).filter(Boolean).length} words` : ""}
            </span>
            <Button
              onClick={handleSummarize}
              disabled={isLoading || !notes.trim()}
              size="lg"
              className="font-body font-semibold px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Summarizing…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Summarize
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Summary Section */}
        {(summary || isLoading) && (
          <SummaryDisplay summary={summary} isLoading={isLoading} />
        )}
      </main>
    </div>
  );
};

export default Index;
