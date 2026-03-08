import { useState, useEffect } from "react";
import { Mail, Sparkles, Loader2, ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import EmailResult from "@/components/EmailResult";
import EmailHistory from "@/components/EmailHistory";
import { processEmail, saveEmailHistory, getEmailHistory } from "@/lib/email-api";

const tones = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
];

const Index = () => {
  const [email, setEmail] = useState("");
  const [tone, setTone] = useState("professional");
  const [summary, setSummary] = useState("");
  const [suggestedResponse, setSuggestedResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    getEmailHistory().then(setHistory);
  }, []);

  const handleProcess = async () => {
    if (!email.trim()) {
      toast.error("Please paste an email first.");
      return;
    }

    setIsLoading(true);
    setSummary("");
    setSuggestedResponse("");

    try {
      const result = await processEmail(email.trim(), tone);
      setSummary(result.summary);
      setSuggestedResponse(result.suggestedResponse);

      // Save to history
      await saveEmailHistory(email.trim(), result.summary, result.suggestedResponse, tone);
      const updated = await getEmailHistory();
      setHistory(updated);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setEmail(text);
      toast.success("Pasted from clipboard!");
    } catch {
      toast.error("Unable to read clipboard.");
    }
  };

  const handleHistorySelect = (item: any) => {
    setEmail(item.original_email);
    setSummary(item.summary);
    setSuggestedResponse(item.suggested_response);
    setTone(item.response_tone);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container max-w-4xl py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Mail className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display tracking-tight text-foreground">
                AI Email Response Assistant
              </h1>
              <p className="text-sm text-muted-foreground font-body">
                Paste an email, get a summary and suggested response instantly
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
              htmlFor="email-input"
              className="text-sm font-semibold text-foreground font-body uppercase tracking-wider"
            >
              Incoming Email
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
            id="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Paste the email you received here..."
            className="w-full min-h-[240px] rounded-xl border border-border bg-card p-5 text-foreground font-body text-[15px] leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/30 resize-y transition-shadow"
          />

          {/* Tone selector */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-body text-muted-foreground">Response tone:</span>
            {tones.map((t) => (
              <button
                key={t.value}
                onClick={() => setTone(t.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-body transition-colors border ${
                  tone === t.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:bg-accent"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-body">
              {email.length > 0 ? `${email.split(/\s+/).filter(Boolean).length} words` : ""}
            </span>
            <Button
              onClick={handleProcess}
              disabled={isLoading || !email.trim()}
              size="lg"
              className="font-body font-semibold px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze & Respond
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Results */}
        {(summary || suggestedResponse) && (
          <EmailResult summary={summary} suggestedResponse={suggestedResponse} />
        )}

        {/* History */}
        <EmailHistory history={history} onSelect={handleHistorySelect} />
      </main>
    </div>
  );
};

export default Index;
