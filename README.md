# botlou build public

Build-in-public site for botlou/Felix, with a small live demo layer.

## What it does

- Preserves the original public build log and project pages.
- Adds a small Felix live-improvement module to the homepage.
- Accepts commands from the page at `/api/command`.
- Accepts Telegram/OpenClaw-shaped payloads at `/api/telegram`.
- Keeps agent/demo state additive so the site remains the artifact.

## Demo commands

```text
/brief
/mission make this educational
/agent critic what can break?
/agent curriculum explain orchestration
/ship show the artifact path
/story tighten the demo arc
```

## Telegram/OpenClaw bridge

`POST /api/telegram?secret=$DEMO_WEBHOOK_SECRET`

```json
{
  "message": {
    "chat": { "id": "YOUR_CHAT_ID" },
    "from": { "username": "hotlou" },
    "text": "/agent curriculum explain orchestration"
  }
}
```

For direct Telegram Bot API replies, set these Vercel env vars:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_ALLOWED_CHAT_ID`
- `DEMO_WEBHOOK_SECRET`

If OpenClaw already owns the Felix bot, have OpenClaw forward Telegram text to this endpoint using the same secret.
