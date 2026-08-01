import { chromium } from "playwright";

const OUT = "/tmp/claude-0/-home-user-pose-pro/7cc30099-1220-565a-a450-2472b814387c/scratchpad";
const BASE = "http://localhost:3200";

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
});
const errors = [];

async function shot(page, name, opts = {}) {
  await page.screenshot({ path: `${OUT}/${name}.png`, ...opts });
  console.log(`shot: ${name}`);
}

// ---------- desktop ----------
const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await desktop.newPage();
page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));
page.on("console", (m) => { if (m.type() === "error") errors.push(`[console] ${m.text()}`); });

await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await shot(page, "01-home");

await page.goto(`${BASE}/poses/`, { waitUntil: "networkidle" });
await page.waitForTimeout(900);
await shot(page, "02-poses");

// Open a pose detail
await page.locator("article button").first().click();
await page.waitForTimeout(700);
await shot(page, "03-pose-detail");
await page.keyboard.press("Escape");

await page.goto(`${BASE}/pricing/`, { waitUntil: "networkidle" });
await shot(page, "04-pricing");

// ---------- studio flow ----------
await page.goto(`${BASE}/studio/`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "New shoot" }).click();
await page.locator("#shoot-name").fill("Ana & Marko");
await page.locator("#shoot-date").fill("2026-09-12");
await page.locator("#shoot-loc").fill("Villa Jelena");
await page.getByRole("button", { name: "Create" }).click();
await page.waitForTimeout(500);
await shot(page, "05-studio-list");

// Enter the shoot
await page.getByText("Ana & Marko").first().click();
await page.waitForTimeout(900);
await shot(page, "06-shoot-poses");

// Auto-build a deck
await page.getByRole("button", { name: "Build me a set" }).click();
await page.waitForTimeout(900);
await shot(page, "07-shoot-built");

// Send tab -> get the link
await page.getByRole("button", { name: "Send to couple" }).click();
await page.waitForTimeout(600);
await shot(page, "08-send");

const deckLink = await page.locator("p.font-mono").first().innerText();
console.log(`deck link length: ${deckLink.length}`);

// Shot list tab
await page.getByRole("button", { name: "Shot list" }).click();
await page.waitForTimeout(800);
await shot(page, "09-shotlist", { fullPage: false });

// ---------- couple's phone ----------
const phone = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});
const mobile = await phone.newPage();
mobile.on("pageerror", (e) => errors.push(`[mobile pageerror] ${e.message}`));

await mobile.goto(deckLink.trim(), { waitUntil: "networkidle" });
await mobile.waitForTimeout(1200);
await shot(mobile, "10-deck-intro");

await mobile.getByRole("button", { name: "Start" }).click();
await mobile.waitForTimeout(900);
await shot(mobile, "11-deck-swipe");

// Answer every card so we reach the finish screen.
for (let i = 0; i < 30; i++) {
  const love = mobile.getByRole("button", { name: "Love it" });
  if (!(await love.isVisible().catch(() => false))) break;
  await love.click();
  await mobile.waitForTimeout(120);
}
await mobile.waitForTimeout(700);
await shot(mobile, "12-deck-finish");

const codeEl = mobile.locator("p.font-mono").first();
const replyCode = (await codeEl.innerText()).trim();
console.log(`reply code: ${replyCode}`);

// ---------- photographer pastes the reply ----------
await page.getByRole("button", { name: "Replies" }).click();
await page.waitForTimeout(400);
await page.locator("#reply-code").fill(replyCode);
await page.getByRole("button", { name: "Add", exact: true }).click();
await page.waitForTimeout(900);
await shot(page, "13-replies");

await page.getByRole("button", { name: "Shot list" }).click();
await page.waitForTimeout(800);
await shot(page, "14-shotlist-prioritised");

// ---------- dark mode ----------
await page.goto(`${BASE}/poses/`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /Switch to dark/ }).click();
await page.waitForTimeout(800);
await shot(page, "15-dark");

console.log(`\n=== ERRORS (${errors.length}) ===`);
errors.slice(0, 15).forEach((e) => console.log(e));

await browser.close();
