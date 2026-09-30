import http from 'node:http';
import {readFile} from 'node:fs/promises';
const port = Number(process.env.PORT || 8080);
const host = process.env.HOST || '0.0.0.0';

const server = http.createServer(async (req, res) => {
 try {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname === '/api/tmy') {
   const lat = Number(url.searchParams.get('lat')), lon = Number(url.searchParams.get('lon'));
   if (!url.searchParams.has('lat') || !url.searchParams.has('lon') || !Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) throw Error('Coordenadas inválidas');
   const upstream = await fetch(`https://re.jrc.ec.europa.eu/api/v5_3/tmy?lat=${lat}&lon=${lon}&outputformat=json`, { signal: AbortSignal.timeout(90000) });
   if (!upstream.ok) throw Error(`PVGIS (${upstream.status}): ${(await upstream.text()).slice(0, 300)}`);
   res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(await upstream.text()); return;
  }
  if (url.pathname === '/panels.json') { res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(await readFile(new URL('./panels.json', import.meta.url))); return; }
  if (url.pathname !== '/' && url.pathname !== '/index.html') { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(await readFile(new URL('./index.html', import.meta.url)));
 } catch (e) { res.writeHead(502, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: e.message })); }
});

server.listen(port, host, () => {
 console.log(`Servidor rodando em http://localhost:${port}`);
});

process.on('SIGTERM', () => {
 server.close(() => process.exit(0));
});

