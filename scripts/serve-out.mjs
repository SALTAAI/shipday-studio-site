// Minimal GitHub-Pages-like static server for out/ (dir index, /x -> /x/ redirect, 404.html)
import http from "node:http"; import fs from "node:fs"; import path from "node:path"; import zlib from "node:zlib";
const root = process.argv[2]; const port = +process.argv[3] || 4310;
const types = {".html":"text/html; charset=utf-8",".css":"text/css",".js":"application/javascript",".svg":"image/svg+xml",".png":"image/png",".ico":"image/x-icon",".txt":"text/plain",".xml":"application/xml",".json":"application/json",".webmanifest":"application/manifest+json",".woff2":"font/woff2"};
http.createServer((req,res)=>{
  let p = decodeURIComponent(new URL(req.url,"http://x").pathname); let f = path.join(root,p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) { if(!p.endsWith("/")){res.writeHead(301,{Location:p+"/"});return res.end();} f=path.join(f,"index.html"); }
  let status=200; if(!fs.existsSync(f)){ status=404; f=path.join(root,"404.html"); }
  let body=fs.readFileSync(f); const h={"Content-Type":types[path.extname(f)]||"application/octet-stream","Cache-Control":p.startsWith("/_next/static")?"public, max-age=31536000, immutable":"max-age=600"};
  if((req.headers["accept-encoding"]||"").includes("gzip")){body=zlib.gzipSync(body);h["Content-Encoding"]="gzip";}
  res.writeHead(status,h); res.end(body);
}).listen(port,()=>console.log("serving",root,"on",port));
