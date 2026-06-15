#!/usr/bin/env node
/**
 * feed-reader-mcp
 * An MCP server that fetches and reads RSS/Atom feeds, so any MCP client
 * (Claude Desktop, Claude Code, etc.) can pull the latest items from blogs,
 * news sites, and release feeds.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import Parser from "rss-parser";

const parser = new Parser({ timeout: 15000 });

const server = new McpServer({
  name: "feed-reader",
  version: "0.1.0",
});

/** Fetch a single RSS/Atom feed and return its recent items. */
server.registerTool(
  "fetch_feed",
  {
    title: "Fetch a feed",
    description:
      "Fetch and parse a single RSS or Atom feed and return its recent items (title, link, date, snippet).",
    inputSchema: {
      url: z.string().url().describe("The feed URL (RSS or Atom)."),
      limit: z
        .number()
        .int()
        .min(1)
        .max(50)
        .default(10)
        .describe("Maximum number of items to return."),
    },
  },
  async ({ url, limit }) => {
    try {
      const feed = await parser.parseURL(url);
      const items = (feed.items ?? []).slice(0, limit).map((it) => ({
        title: it.title ?? "",
        link: it.link ?? "",
        date: it.isoDate ?? it.pubDate ?? "",
        snippet: (it.contentSnippet ?? it.content ?? "").slice(0, 300),
      }));
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { feed: feed.title ?? url, count: items.length, items },
              null,
              2
            ),
          },
        ],
      };
    } catch (e) {
      return {
        isError: true,
        content: [
          { type: "text", text: `Failed to fetch feed "${url}": ${(e as Error).message}` },
        ],
      };
    }
  }
);

/** Fetch multiple feeds and return a merged, date-sorted list. */
server.registerTool(
  "fetch_many",
  {
    title: "Fetch multiple feeds",
    description:
      "Fetch several RSS/Atom feeds and return a merged, date-sorted list of recent items. Useful for building a digest.",
    inputSchema: {
      urls: z
        .array(z.string().url())
        .min(1)
        .max(20)
        .describe("List of feed URLs."),
      perFeed: z
        .number()
        .int()
        .min(1)
        .max(20)
        .default(5)
        .describe("Maximum items to take from each feed."),
    },
  },
  async ({ urls, perFeed }) => {
    const all: Array<Record<string, string>> = [];
    const errors: string[] = [];
    await Promise.all(
      urls.map(async (u) => {
        try {
          const feed = await parser.parseURL(u);
          for (const it of (feed.items ?? []).slice(0, perFeed)) {
            all.push({
              source: feed.title ?? u,
              title: it.title ?? "",
              link: it.link ?? "",
              date: it.isoDate ?? it.pubDate ?? "",
              snippet: (it.contentSnippet ?? "").slice(0, 200),
            });
          }
        } catch (e) {
          errors.push(`${u}: ${(e as Error).message}`);
        }
      })
    );
    all.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ count: all.length, items: all, errors }, null, 2),
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
