# botlou build public

Interactive build-in-public demo for botlou/Felix.

## What it does

- Shows a live agent team control room.
- Accepts commands from the page at `/api/command`.
- Accepts Telegram/OpenClaw-shaped payloads at `/api/telegram`.
- Explains the agent workflow while it changes visible demo state.

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
