import fs from "fs";
import puppeteer from "puppeteer-core";

const executablePath = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find(fs.existsSync);

const browser = await puppeteer.launch({ executablePath, headless: "new" });
const page = await browser.newPage();

await page.setViewport({ width: 832, height: 1000, deviceScaleFactor: 2 });
await page.goto(`file:///${process.cwd().replace(/\\/g, "/")}/index.html`, { waitUntil: "networkidle0" });
await page.emulateMediaType("screen");

await page.addStyleTag({
  content:
    "html,body{margin:0!important;padding:0!important;background:#fff!important}#resume{width:100%!important;margin:0!important;padding:0.5rem 0!important;box-sizing:border-box!important}#skills{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:1.2rem 1rem!important;width:100%!important}#skills .item{width:100%!important;padding:0!important}",
});

const bodyHeight = await page.evaluate(() => document.getElementById("resume").scrollHeight);
const heightMm = Math.ceil((bodyHeight * 25.4) / 96) + 80;
const outputPath = "public/karlobencic_cv.pdf";

await page.pdf({
  path: outputPath,
  width: "240mm",
  height: `${heightMm}mm`,
  printBackground: true,
  margin: { top: "10mm", right: "18mm", bottom: "20mm", left: "18mm" },
});

await browser.close();
console.log(`[pdf] Exported to ${outputPath} (240x${heightMm}mm)`);
