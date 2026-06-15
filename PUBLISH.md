# 公開手順 (feed-reader-mcp) — Codex for OSS 申請の客観証跡づくり

> 目的: GitHub公開 → npm publish(DL実数) → 公式MCP Registry掲載 → awesomeリスト掲載。
> これが OpenAI Codex for OSS の審査軸「利用実態 / エコシステム上の重要性 / 活発な保守」を満たす客観証跡になる。

## 0. 事前
- Node 18+ / npm アカウント(無料) / GitHub `tono628develop`。
- 秘密情報(npmトークン等)は **Bitwarden / 環境変数**。vault・このリポに置かない。

## 1. ローカルで動作確認
```bash
cd ~/oss/feed-reader-mcp
npm install
npm run build
# 簡易起動確認(stdioサーバなので Ctrl-C で抜ける)
npm start
```
Claude Code の `.mcp.json` に登録して `fetch_feed` を実際に叩く → 動作デモをREADME/スクショに。

## 2. GitHub に公開
```bash
git init
git add .
git commit -m "feat: initial RSS/Atom feed reader MCP server"
git branch -M main
git remote add origin https://github.com/tono628develop/feed-reader-mcp.git
git push -u origin main
```
GitHub の repo を Public に。Description / Topics(`mcp` `rss` `claude`)を設定。

## 3. npm publish (DL実数の源)
```bash
npm login
npm publish --access public
```
→ 以後、`npm view feed-reader-mcp` や npm のDLグラフが「利用実態」の証跡に。

## 4. 公式 MCP Registry に掲載 (最重要の客観証跡)
```bash
# mcp-publisher を入れて
npx @modelcontextprotocol/publisher init   # server.json は同梱済
npx @modelcontextprotocol/publisher login github
npx @modelcontextprotocol/publisher publish
```
→ registry.modelcontextprotocol.io に `io.github.tono628develop/feed-reader` が載る。

## 5. awesome リストへ掲載PR (downstream認知)
- `punkpeye/awesome-mcp-servers` 等にカテゴリ追加のPR。
- (Claude Code向けにも作るなら)`hesreallyhim/awesome-claude-code`。

## 6. 保守を継続 (3ヶ月の活発な履歴)
- issue対応・小機能追加・リリースタグを定期的に。これ自体が審査軸「active maintenance」。

## 7. 申請
- 実績(Registry掲載・npm DL・awesome掲載・保守履歴)が揃ったら
  https://openai.com/form/codex-for-oss/ に申請。設問「なぜ重要か」に具体数を書く。
