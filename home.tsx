import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import NytInsightTrustMode from "@/components/NytInsightTrustMode";

export default function Home() {
  const [apiResponse, setApiResponse] = useState<string>("");
  const [apiError, setApiError] = useState<string | null>(null);

  const [nytQuestion, setNytQuestion] = useState("");
  const [viewMode, setViewMode] = useState<"standard" | "eli12" | "relevance">(
    "standard"
  );

  const askNytMutation = useMutation({
    mutationFn: async (question: string) => {
      const q = question.trim();
      setApiError(null);
      const res = await apiRequest("POST", "/api/ask", { question: q });
      return res.json();
    },
    onSuccess: (data) => {
      setApiResponse(JSON.stringify(data, null, 2));
      setApiError(null);
      setNytQuestion("");
      setViewMode("standard");
    },
    onError: (error: any) => {
      setApiError(`Failed to ask NYT Insight: ${error.message}`);
      setApiResponse("");
    },
  });

  return (
    <div className="min-h-screen bg-background flex items-start justify-center py-12">
      <div className="w-full max-w-3xl px-4">
        <NytInsightTrustMode
          apiResponse={apiResponse}
          apiError={apiError}
          isLoading={askNytMutation.isPending}
          nytQuestion={nytQuestion}
          setNytQuestion={setNytQuestion}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAsk={(q) => askNytMutation.mutate(q.trim())}
        />
      </div>
    </div>
  );
}
