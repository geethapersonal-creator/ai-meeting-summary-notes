import { formatDistanceToNow } from "date-fns";
import { History, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface HistoryItem {
  id: string;
  original_email: string;
  summary: string;
  suggested_response: string;
  response_tone: string;
  created_at: string;
}

interface EmailHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const EmailHistory = ({ history, onSelect }: EmailHistoryProps) => {
  const [expanded, setExpanded] = useState(false);

  if (history.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card p-6 space-y-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-display text-foreground">History</h2>
          <span className="text-xs text-muted-foreground font-body">
            ({history.length})
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="space-y-2">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left rounded-lg border border-border/50 p-4 hover:bg-accent/50 transition-colors space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-body text-muted-foreground capitalize">
                  {item.response_tone} tone
                </span>
                <span className="text-xs font-body text-muted-foreground">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm font-body text-foreground line-clamp-2">
                {item.summary || item.original_email.slice(0, 100) + "…"}
              </p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default EmailHistory;
