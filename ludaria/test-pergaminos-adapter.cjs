/** Adaptador preparado con doble de nube. No habilita la ruta ni valida Google real. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const server = http.createServer((request, response) => {
  const url = new URL(request.url, "http://localhost");
  let file = path.join(root, url.pathname);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory())
    file = path.join(file, "index.html");
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) {
    response.statusCode = 404;
    response.end();
    return;
  }
  response.setHeader(
    "content-type",
    file.endsWith(".js")
      ? "text/javascript; charset=utf-8"
      : file.endsWith(".css")
        ? "text/css; charset=utf-8"
        : "text/html; charset=utf-8",
  );
  response.end(fs.readFileSync(file));
});

(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = "http://127.0.0.1:" + server.address().port;
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.addInitScript(() => {
      window.__savedPergaminos = [];
      window.LudariaCloud = {
        active: true,
        ready: Promise.resolve({}),
        loadMission: async () => ({
          version: 1,
          page: 1,
          fields: { duda: "Duda recuperada desde otra sesión" },
          checks: {},
          visited: [0, 1],
          open: false,
        }),
        saveMission: (snapshot) =>
          window.__savedPergaminos.push(JSON.parse(JSON.stringify(snapshot))),
      };
      Storage.prototype.getItem = () => {
        throw new Error("El adaptador central no debe leer localStorage");
      };
      Storage.prototype.setItem = () => {
        throw new Error("El adaptador central no debe escribir localStorage");
      };
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base + "/pergaminos-dispersos/presentacion.html");
    const field = page.locator('[data-field="duda"]');
    await field.waitFor();
    assert.equal(await field.inputValue(), "Duda recuperada desde otra sesión");
    await field.fill("Nueva duda confirmable");
    await page.waitForFunction(() =>
      window.__savedPergaminos.some(
        (snapshot) => snapshot.fields.duda === "Nueva duda confirmable",
      ),
    );
    assert.equal(await page.locator("#store").innerText(), "Bitácora central pendiente de confirmación");
    await page.getByRole("button", { name: "Bitácora" }).click();
    assert.match(await page.locator("#modal-body").innerText(), /asociada a tu personaje/i);
    assert.equal(errors.length, 0);
    await page.screenshot({
      path: __dirname + "/preview-pergaminos-central.png",
      fullPage: true,
    });
    console.log(
      "Pergaminos: recuperación y guardado con nube simulada, localStorage bloqueado y móvil 390px OK; ruta real pendiente.",
    );
  } finally {
    await browser.close();
    server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
