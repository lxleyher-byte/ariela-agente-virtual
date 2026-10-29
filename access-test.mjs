import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const port = 30000 + (process.pid % 20000);
const base = `http://127.0.0.1:${port}`;
const fakeKey = 'test-api-key-not-real';
const testCode = 'test-access-code-not-real';
const child = spawn(process.execPath, ['server.js'], {
  cwd: new URL('.', import.meta.url),
  env: { ...process.env, PORT: String(port), GROQ_API_KEY: fakeKey, ARIELA_ACCESS_CODE: testCode },
  stdio: ['ignore', 'pipe', 'pipe']
});
let output = '';
child.stdout.on('data', chunk => { output += chunk.toString(); });
child.stderr.on('data', chunk => { output += chunk.toString(); });

async function waitReady(attempts = 30) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try { return await fetch(`${base}/api/health`); }
    catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  throw lastError || new Error('El servidor de prueba no inició.');
}

async function postChat({ code = '', body = { messages: [{ role: 'user', content: 'Hola' }] } } = {}) {
  return fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: base,
      'X-ARIELA-ACCESS-CODE': code
    },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  });
}

let passed = 0;
async function check(name, fn) {
  await fn();
  passed += 1;
  console.log(`APROBADO · ${name}`);
}

try {
  const healthResponse = await waitReady();
  await check('el servidor detecta variables configuradas sin revelar sus valores', async () => {
    assert.equal(healthResponse.status, 200);
    const data = await healthResponse.json();
    assert.equal(data.mode, 'connected');
    assert.equal(data.accessRequired, true);
    assert.equal(JSON.stringify(data).includes(fakeKey), false);
    assert.equal(JSON.stringify(data).includes(testCode), false);
    assert.match(data.message, /se verifica al enviar un mensaje/);
  });

  await check('el endpoint rechaza una petición sin código privado', async () => {
    const response = await postChat();
    assert.equal(response.status, 401);
    assert.equal((await response.json()).error, 'access_code_invalid');
  });

  await check('el endpoint rechaza un código incorrecto', async () => {
    const response = await postChat({ code: 'código-falso' });
    assert.equal(response.status, 401);
    assert.equal((await response.json()).error, 'access_code_invalid');
  });

  await check('el endpoint valida conversaciones vacías antes de llamar al proveedor', async () => {
    const response = await postChat({ code: testCode, body: { messages: [] } });
    assert.equal(response.status, 400);
    assert.equal((await response.json()).error, 'invalid_messages');
  });

  await check('el endpoint rechaza mensajes demasiado largos antes de llamar al proveedor', async () => {
    const response = await postChat({ code: testCode, body: { messages: [{ role: 'user', content: 'a'.repeat(1201) }] } });
    assert.equal(response.status, 400);
    assert.equal((await response.json()).error, 'invalid_messages');
  });

  await check('el endpoint gestiona JSON inválido con un error controlado', async () => {
    const response = await postChat({ code: testCode, body: '{mal JSON' });
    assert.equal(response.status, 400);
    assert.equal((await response.json()).error, 'invalid_json');
  });

  console.log(`\nResultado de acceso: ${passed}/6 pruebas aprobadas.`);
} catch (error) {
  console.error('\nPRUEBA DE ACCESO FALLIDA:', error?.stack || error);
  if (output) console.error('\nSalida del servidor de prueba:\n' + output);
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
