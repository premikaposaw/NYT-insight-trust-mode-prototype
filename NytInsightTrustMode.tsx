import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

type ViewMode = "standard" | "eli12" | "relevance";

type Props = {
  apiResponse: string;
  apiError: string | null;
  isLoading: boolean;
  nytQuestion: string;
  setNytQuestion: (v: string) => void;

  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;

  onAsk: (q: string) => void;
};

function safeParseJson<T = any>(value: string): T | null {
  try {
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

function formatTruthLabel(label?: string) {
  const l = String(label || "").toLowerCase();
  if (l === "confirmed") return "Confirmed";
  if (l === "developing") return "Developing";
  if (l === "uncertain") return "Uncertain";
  return l ? l.charAt(0).toUpperCase() + l.slice(1) : "";
}

function truthBadgeClass(label?: string) {
  const l = String(label || "").toLowerCase();

  if (l === "confirmed") return "bg-green-100 text-green-800 border-green-200";
  if (l === "developing") return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (l === "uncertain") return "bg-red-100 text-red-800 border-red-200";

  return "bg-muted text-muted-foreground border-border";
}

export default function NytInsightTrustMode({
  apiResponse,
  apiError,
  isLoading,
  nytQuestion,
  setNytQuestion,
  viewMode,
  setViewMode,
  onAsk,
}: Props) {
  const parsed = safeParseJson<any>(apiResponse);

  // Per your request: always show Medium (but only AFTER answer appears)
  const confidence = "Medium";
  const confidenceClass = "bg-yellow-100 text-yellow-800";

  const hasEli12 = Boolean(parsed?.eli12);
  const hasRelevance = Boolean(parsed?.relevance_nyc);

  const mainTitle = viewMode === "relevance" ? "Why this matters to you" : "Answer";

  const mainText =
    viewMode === "relevance"
      ? parsed?.relevance_nyc
      : viewMode === "eli12"
      ? parsed?.eli12
      : parsed?.answer;

  // ✅ Animated confidence: only show after response exists + not loading
  const [showConfidence, setShowConfidence] = useState(false);

  useEffect(() => {
    if (parsed && !isLoading) {
      setShowConfidence(true);
    }
  }, [parsed, isLoading]);

  const handleAsk = () => {
    const q = nytQuestion.trim();
    if (!q || isLoading) return;

    // Hide pill during the new request; it will fade back in once response returns
    setShowConfidence(false);
    onAsk(q);
  };

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">NYT Insight™ – Trust Mode</CardTitle>
            <CardDescription>
              Verified answers grounded in New York Times reporting
            </CardDescription>
          </div>

          {/* ✅ Fade-in confidence after answer appears */}
          <div
            className={[
              "transition-all duration-300 ease-out",
              showConfidence
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4 pointer-events-none",
            ].join(" ")}
            aria-hidden={!showConfidence}
          >
            <Badge className={confidenceClass}>
              Confidence: {confidence}
            </Badge>
          </div>

        </div>

        {parsed?.confidence_reason && (
          <p className="text-xs text-muted-foreground max-w-xl">
            {parsed.confidence_reason}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Ask NYT Insight</label>
          <div className="flex gap-2">
            <Input
              placeholder="Ask us a question you would like verified"
              value={nytQuestion}
              onChange={(e) => {
                setNytQuestion(e.target.value);
                // ✅ hide confidence when user starts a new question
                setShowConfidence(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && nytQuestion.trim() && !isLoading) {
                  handleAsk();
                }
              }}
              disabled={isLoading}
            />
            <Button onClick={handleAsk} disabled={!nytQuestion.trim() || isLoading}>
              Ask
            </Button>
          </div>
        </div>

        {/* View mode buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={viewMode === "standard" ? "default" : "outline"}
            onClick={() => setViewMode("standard")}
          >
            Standard
          </Button>

          <Button
            size="sm"
            variant={viewMode === "eli12" ? "default" : "outline"}
            onClick={() => setViewMode("eli12")}
            disabled={!hasEli12}
          >
            Explain like I’m 12
          </Button>

          <Button
            size="sm"
            variant={viewMode === "relevance" ? "default" : "outline"}
            onClick={() => setViewMode("relevance")}
            disabled={!hasRelevance}
          >
            Why this matters to you
          </Button>
        </div>

        {/* Response */}
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating verified answer…
          </div>
        ) : parsed ? (
          <div className="space-y-6">
            {/* Main text */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">{mainTitle}</h4>
              <p className="text-sm leading-relaxed">
                {mainText ?? "No content returned for this view."}
              </p>
            </div>

            {/* What’s confirmed vs. still evolving */}
            {Array.isArray(parsed?.truth_lens) && parsed.truth_lens.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">
                  What’s confirmed vs. still evolving
                </h4>
                <p className="text-xs text-muted-foreground">
                  We separate settled facts from still-developing claims.
                </p>

                <div className="space-y-2">
                  {parsed.truth_lens.map((t: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm rounded-md border p-3"
                    >
                      <Badge className={truthBadgeClass(t.label)}>
                        {formatTruthLabel(t.label)}
                      </Badge>
                      <span>{t.sentence}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sources */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Sources</h4>
              <div className="space-y-2">
                {parsed.citations?.map((c: any, i: number) => (
                  <a
                    key={i}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-md border p-3 hover:bg-muted transition"
                  >
                    <div className="text-sm font-medium">{c.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{c.snippet}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {apiError && <div className="text-sm text-red-600">{apiError}</div>}


        {/* Prototype disclaimer */}
          <div className="pt-6 border-t text-xs text-muted-foreground opacity-60">

          Concept prototype. Not affiliated with or endorsed by The New York Times.
        </div>

      </CardContent>
    </Card>
  );
}
