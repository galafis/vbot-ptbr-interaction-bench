import {createServer} from 'node:http';import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const routes={'/':'index.html','/app.mjs':'app.mjs','/src/engine.mjs':'src/engine.mjs','/src/contract.mjs':'src/contract.mjs','/examples/baseline.json':'examples/baseline.json'};
const mime={html:'text/html; charset=utf-8',mjs:'text/javascript; charset=utf-8',json:'application/json; charset=utf-8',md:'text/plain; charset=utf-8'};
const server=createServer(async(req,res)=>{
  const path=new URL(req.url,'http://127.0.0.1').pathname,file=routes[path];
  if(!file){res.writeHead(404);res.end('Not found');return;}
  try{const data=await readFile(fileURLToPath(new URL(file,import.meta.url)));
    res.writeHead(200,{'Content-Type':mime[file.split('.').pop()],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(data);
  }catch{res.writeHead(500);res.end('Unable to read local asset');}
});
server.listen(8765,'127.0.0.1',()=>console.log('Open http://127.0.0.1:8765; Ctrl+C to stop'));
