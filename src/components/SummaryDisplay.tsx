import ReactMarkdown from "react-markdown";
import { Loader2 } from "lucide-react";

interface SummaryDisplayProps {
  summary: string;
  isLoading: boolean;
}

const SummaryDisplay = ({ summary, isLoading }: SummaryDisplayProps) => {
  return (
    <section className="rounded-xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-display text-foreground">Summary</h2>
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        )}
      </div>
      <div className="prose prose-sm max-w-none font-body text-foreground prose-headings:font-display prose-headings:text-foreground prose-h2:text-base prose-h2:mt-6 prose-h2:mb-2 prose-ul:my-2 prose-li:my-0.5 prose-p:text-foreground/90 prose-p:leading-relaxed prose-strong:text-foreground">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
      {!summary && isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-body">
          <span>Analyzing your meeting notes…</span>
        </div>
      )}
    </section>
  );
};

export default SummaryDisplay;
