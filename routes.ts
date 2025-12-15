import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { messageSchema, type ApiResponse, type ServerStatus } from "@shared/schema";
import fs from "fs";
import path from "path";
function loadArticles() {
  const dir = path.join(process.cwd(), "articles");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".txt"));

  // Map filenames to NYT titles + real URLs (your 3 live links)
  const META: Record<string, { title: string; url: string }> = {
    "article1.txt": {
      title: "Israel-Hamas Cease-Fire Talks Face Stalemate as Trump Shifts Focus to Ukraine",
      url: "https://www.nytimes.com/2025/03/13/world/middleeast/israel-hamas-ceasefire-trump-ukraine.html",
    },
    "article2.txt": {
      title: "How the Cease-Fire Push Brought Together Biden and Trump’s Teams",
      url: "https://www.nytimes.com/2025/01/15/us/politics/gaza-ceasefire-trump-biden.html",
    },
    "article3.txt": {
      title: "Gaza Cease-Fire Negotiations Reach an Impasse",
      url: "https://www.nytimes.com/2025/06/02/world/middleeast/gaza-cease-fire-negotiations-impasse.html",
    },
  };

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");

    // Optional: still support URL: lines inside the file (overrides META)
    const urlMatch = raw.match(/^URL:\s*(.+)$/m);
    const urlFromFile = urlMatch ? urlMatch[1].trim() : undefined;

    const meta = META[file];

    return {
      file,
      raw,
      title: meta?.title ?? file.replace(/\.txt$/i, ""),
      url: urlFromFile ?? meta?.url, // prefer URL in the txt, else META
    };
  });
}



function scoreText(text: string, question: string) {
  const words = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  let score = 0;
  for (const w of words) {
    if (text.toLowerCase().includes(w)) score += 1;
  }
  return score;
}


const startTime = Date.now();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // GET /api/status - Server status endpoint
  app.get("/api/status", (req, res) => {
    const status: ServerStatus = {
      status: "online",
      uptime: Math.floor((Date.now() - startTime) / 1000),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development"
    };
    res.json(status);
  });

  // GET /api/data - Sample data endpoint
  app.get("/api/data", (req, res) => {
    const response: ApiResponse = {
      success: true,
      data: {
        items: [
          { id: 1, name: "Express.js", description: "Fast, unopinionated web framework" },
          { id: 2, name: "Node.js", description: "JavaScript runtime environment" },
          { id: 3, name: "TypeScript", description: "Typed JavaScript at scale" }
        ],
        count: 3
      },
      message: "Data retrieved successfully",
      timestamp: new Date().toISOString()
    };
    res.json(response);
  });

  // POST /api/echo - Echo endpoint for testing POST requests
  app.post("/api/echo", (req, res) => {
    const result = messageSchema.safeParse(req.body);
    
    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid request body. Please provide a 'message' field.",
        timestamp: new Date().toISOString()
      };
      return res.status(400).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: {
        received: result.data.message,
        processed: result.data.message.toUpperCase(),
        length: result.data.message.length
      },
      message: "Message processed successfully",
      timestamp: new Date().toISOString()
    };
    res.json(response);
  });
  // POST /api/ask - NYT Insight demo endpoint (local articles + trust UI fields)
  app.post("/api/ask", async (req, res) => {
    try {
      const question = String(req.body?.question || "").trim();
      if (!question) {
        return res.status(400).json({ error: "Missing question" });
      }

      const articles = loadArticles();

      // Break each file into paragraph-ish chunks
      const chunks: { file: string; paragraph: number; text: string; score: number }[] = [];
      for (const a of articles) {
        const lines = a.raw.split("\n").filter((l) => l.trim().length > 40);
        lines.forEach((text, i) => {
          chunks.push({
            file: a.file,
            paragraph: i,
            text,
            score: scoreText(text, question),
          });
        });
      }

      chunks.sort((x, y) => y.score - x.score);
      const top = chunks.slice(0, 5);

      // Build citations from top chunks (can contain duplicates per article)
      const citationsAll = top.map((c) => {
        const article = articles.find((a) => a.file === c.file);

        return {
          title: article?.title || c.file,
          url: article?.url,
          paragraph: c.paragraph + 1,
          snippet: c.text.slice(0, 160) + (c.text.length > 160 ? "..." : ""),
          file: c.file, // keep internal key for de-duping if url missing
        };
      });

      // ✅ Dedupe: keep one citation per article
      // Prefer url as the unique key; fallback to file+title
      const citations = Array.from(
        new Map(
          citationsAll.map((c) => {
            const key = c.url ?? `${c.file}::${c.title}`;
            return [key, c] as const;
          })
        ).values()
      ).map(({ file, ...rest }) => rest); // strip internal field

      // ✅ Now these match what you actually display
      const distinctSources = citations.length;

      const bestScore = top[0]?.score ?? 0;

      let confidence = "Review Needed";
      if (bestScore >= 6 && distinctSources >= 2) confidence = "High";
      else if (bestScore >= 3) confidence = "Medium";

      return res.json({
        answer:
          "Ceasefire talks continue but remain fragile. Negotiators are trying to bridge gaps on the terms of a temporary halt in fighting and the release of hostages and prisoners, but key disagreements remain and timelines are uncertain.",
        confidence,
        confidence_reason:
          distinctSources >= 2
            ? `${distinctSources} sources retrieved; strong match on query`
            : `Only ${distinctSources} source retrieved; needs editorial review`,
        citations,
        eli12:
          "People are trying to pause the fighting for a while. They are discussing what each side must do, like releasing people being held. They are talking, but they haven’t agreed yet.",
        truth_lens: [
          { sentence: "Negotiators are still in talks.", label: "confirmed" },
          { sentence: "A ceasefire agreement could happen soon.", label: "developing" },
          { sentence: "The final deal terms and timing are uncertain.", label: "uncertain" },
        ],
        relevance_nyc:
          "For New Yorkers, the conflict affects U.S. foreign policy decisions, global economic stability, and local communities with family, cultural, or political ties to the region.",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  });

  // GET /api/hello - Simple greeting endpoint
  app.get("/api/hello", (req, res) => {
    const name = req.query.name as string || "World";
    const response: ApiResponse = {
      success: true,
      data: {
        greeting: `Hello, ${name}!`
      },
      message: "Greeting generated",
      timestamp: new Date().toISOString()
    };
    res.json(response);
  });

  return httpServer;
}
