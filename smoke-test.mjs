import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const port = 43000 + (process.pid % 15000);
const base = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ['server.js'], {
  cwd: new URL('.', import.meta.url),
  env: { ...process.env, PORT: String(port), GROQ_API_KEY: '', ARIELA_ACCESS_CODE: '' },
  stdio: ['ignore', 'pipe', 'pipe']
});
let childOutput = '';
child.stdout.on('data', chunk => { childOutput += chunk.toString(); });
child.stderr.on('data', chunk => { childOutput += chunk.toString(); });

async function fetchReady(url, attempts = 30) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try { return await fetch(url); }
    catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  throw lastError || new Error('El servidor no inició.');
}

let passed = 0;
async function check(name, fn) {
  await fn();
  passed += 1;
  console.log(`APROBADO · ${name}`);
}

try {
  const healthResponse = await fetchReady(`${base}/api/health`);
  await check('GET /api/health entrega estado de demostración', async () => {
    assert.equal(healthResponse.status, 200);
    const data = await healthResponse.json();
    assert.equal(data.ok, true);
    assert.equal(data.version, '0.3.0');
    assert.equal(data.mode, 'demo');
    assert.equal(data.accessRequired, false);
    assert.ok(healthResponse.headers.get('content-security-policy'));
    assert.equal(healthResponse.headers.get('x-content-type-options'), 'nosniff');
  });

  await check('la página principal carga y no contiene el aviso antiguo contradictorio', async () => {
    const response = await fetch(`${base}/`);
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.match(html, /ARIELA AGENTE VIRTUAL/);
    assert.match(html, /Prototipo web v0\.3\.0/);
    assert.doesNotMatch(html, /La versión de IA real requiere configurar un proveedor y un servidor seguro/);
    const match = html.match(/<script>([\s\S]*?)<\/script>/i);
    assert.ok(match, 'Debe existir el script integrado de la página');
    assert.doesNotThrow(() => new Function(match[1]), 'El script integrado debe analizarse sintácticamente');
  });

  await check('manifiesto PWA disponible y JSON válido', async () => {
    const response = await fetch(`${base}/manifest.webmanifest`);
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.name, 'ARIELA Agente Virtual');
    assert.ok(data.icons.some(icon => icon.sizes === '192x192'));
  });

  await check('service worker disponible', async () => {
    const response = await fetch(`${base}/sw.js`);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /startsWith\('\/api\/'\)/);
  });

  await check('archivos internos no se publican por la ruta estática', async () => {
    for (const file of ['/server.js', '/.env.example', '/README.md', '/package.json']) {
      const response = await fetch(`${base}${file}`);
      assert.equal(response.status, 404, `${file} debe devolver 404`);
    }
  });

  await check('el chat desde un origen distinto se rechaza', async () => {
    const response = await fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://example.invalid' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hola' }] })
    });
    assert.equal(response.status, 403);
    const data = await response.json();
    assert.equal(data.error, 'origin_not_allowed');
  });

  await check('el chat da un error controlado cuando la IA no está configurada', async () => {
    const response = await fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: `${base}` },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hola' }] })
    });
    assert.equal(response.status, 503);
    const data = await response.json();
    assert.equal(data.error, 'ai_not_configured');
    assert.ok(data.message);
  });

  await check('rutas API desconocidas no exponen archivos', async () => {
    const response = await fetch(`${base}/api/private`);
    assert.equal(response.status, 405);
    const data = await response.json();
    assert.equal(data.error, 'method_not_allowed');
  });

  await check('configuración del proyecto y archivos obligatorios están presentes', async () => {
    const pkg = JSON.parse(await readFile(new URL('./package.json', import.meta.url), 'utf8'));
    assert.equal(pkg.version, '0.3.0');
    const ignored = await readFile(new URL('./.gitignore', import.meta.url), 'utf8');
    assert.match(ignored, /^\.env$/m);
    const example = await readFile(new URL('./.env.example', import.meta.url), 'utf8');
    assert.match(example, /GROQ_API_KEY=\s*$/m);
    assert.match(example, /ARIELA_ACCESS_CODE=\s*$/m);
  });

  console.log(`\nResultado automático: ${passed}/9 pruebas aprobadas.`);
} catch (error) {
  console.error('\nPRUEBA FALLIDA:', error?.stack || error);
  if (childOutput) console.error('\nSalida del servidor:\n' + childOutput);
  process.exitCode = 1;
} finally {
  child.kill('SIGTERM');
  if (child.exitCode === null) {
    await Promise.race([
      new Promise(resolve => child.once('exit', resolve)),
      new Promise(resolve => setTimeout(resolve, 1000))
    ]);
  }
}
