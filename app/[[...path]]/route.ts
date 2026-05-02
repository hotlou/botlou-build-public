import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function safePublicPath(parts: string[]) {
  const route = parts.length ? parts.join("/") : "index.html";
  const withIndex = extname(route) ? route : join(route, "index.html");
  const normalized = normalize(withIndex).replace(/^(\.\.(\/|\\|$))+/, "");
  return join(process.cwd(), "public", normalized);
}

function enhanceHome(html: string) {
  const panel = `
  <section class="felix-live-layer" aria-label="Felix live demo layer">
    <div>
      <span class="felix-live-kicker">Felix live improvement layer</span>
      <h2>This site stays the artifact. Felix improves it during the demo.</h2>
      <p>Telegram/OpenClaw commands can update the live agent state through <code>/api/telegram</code> while the build-in-public log remains intact.</p>
      <div class="felix-live-actions">
        <button data-felix-command="/mission improve this build log without replacing it">Improve log</button>
        <button data-felix-command="/agent critic what should not change?">Ask Critic</button>
        <button data-felix-command="/story explain the improvement">Narrate</button>
      </div>
      <pre id="felix-live-output">Ready for Felix direction.</pre>
    </div>
  </section>`;
  const script = `
  <script>
    document.querySelectorAll('[data-felix-command]').forEach((button) => {
      button.addEventListener('click', async () => {
        const output = document.getElementById('felix-live-output');
        output.textContent = 'Routing: ' + button.dataset.felixCommand;
        const res = await fetch('/api/command', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ command: button.dataset.felixCommand, source: 'public-site' })
        });
        const data = await res.json();
        const event = data.state.events[0];
        output.textContent = event.agent + ': ' + event.title + '\\n' + event.detail;
      });
    });
  </script>`;
  return html.replace("</main>", `${panel}</main>`).replace("</body>", `${script}</body>`);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const params = await context.params;
  const parts = params.path ?? [];
  const filePath = safePublicPath(parts);
  const extension = extname(filePath);

  try {
    let body = await readFile(filePath);
    const isHome = parts.length === 0 && extension === ".html";

    if (isHome) {
      body = Buffer.from(enhanceHome(body.toString("utf8")));
    }

    return new NextResponse(body, {
      headers: {
        "content-type": contentTypes[extension] ?? "application/octet-stream",
        "cache-control": "public, max-age=0, must-revalidate"
      }
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
