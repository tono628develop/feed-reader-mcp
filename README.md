# feed-reader-mcp

An [MCP](https://modelcontextprotocol.io) server that fetches and reads **RSS / Atom feeds**, so any MCP client (Claude Desktop, Claude Code, etc.) can pull the latest items from blogs, news sites, and release feeds — and build digests.

## Why

LLM clients can't reliably read RSS on their own. This server exposes two simple tools so an agent can stay current with the feeds you care about (release notes, news, blogs) without scraping.

## Tools

| Tool | What it does |
|------|--------------|
| `fetch_feed` | Fetch one RSS/Atom feed → recent items (title, link, date, snippet). |
| `fetch_many` | Fetch several feeds → one merged, date-sorted list (a digest). |

## Install

```bash
npm install -g feed-reader-mcp
```

## Use with Claude Desktop / Claude Code

Add to your MCP config (`claude_desktop_config.json` or `.mcp.json`):

```json
{
  "mcpServers": {
    "feed-reader": {
      "command": "npx",
      "args": ["-y", "feed-reader-mcp"]
    }
  }
}
```

Then ask: *"Use feed-reader to get the latest 5 items from https://hnrss.org/frontpage"* or *"Build a digest from these three feeds…"*.

## Develop

```bash
npm install
npm run build
npm start          # runs over stdio
```

## License

MIT © tono628develop
