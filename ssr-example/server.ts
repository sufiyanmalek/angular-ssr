import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import cors from 'cors';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();
  server.use(
    cors({
      origin: '*',
    })
  );

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  server.get('/api/users', (req, res) => {
    const queryParams = req.query;
    console.log('🚀 ~ server.get ~ req.query:', req.query);
    let users = [
      {
        id: 1,
        name: 'Sufiyan Malek',
        age: 22,
        gender: 'Male',
      },
      {
        id: 2,
        name: 'Riya Dahat',
        age: 18,
        gender: 'Female',
      },
      {
        id: 3,
        name: 'Dev Patel',
        age: 24,
        gender: 'Male',
      },
      {
        id: 4,
        name: 'Vismay Chovatiya',
        age: 23,
        gender: 'Male',
      },
      {
        id: 5,
        name: 'Yukta Saraiya',
        age: 26,
        gender: 'Female',
      },
    ];


    if (queryParams) {
      if (queryParams['_order'] !== '') {
          if(queryParams['_sort'] === "id"){
            if (queryParams['_order'] === 'asc') {
              users = users.sort((user1, user2) => user1.id - user2.id);
            } else {
              users = users.sort((user1, user2) => user2.id - user1.id);
            }
          }else if(queryParams['_sort'] === "name"){
            if (queryParams['_order'] === 'asc') {
              users = users.sort((a, b)=>{
                let x = a.name.toLowerCase();
                let y = b.name.toLowerCase();
                if(x>y){return 1;} 
                if(x<y){return -1;}
                return 0;
              })
            }else{
              users = users.sort((a, b)=>{
                let x = a.name.toLowerCase();
                let y = b.name.toLowerCase();
                if(x>y){return -1;} 
                if(x<y){return 1;}
                return 0;
              })
            }
            
          }else if(queryParams['_sort'] === "age"){
            if (queryParams['_order'] === 'asc') {
              users = users.sort((user1, user2) => user1.age - user2.age);
            } else {
              users = users.sort((user1, user2) => user2.age - user1.age);
            }
          }else if(queryParams['_sort'] === "gender"){
            if (queryParams['_order'] === 'asc') {
              users = users.sort((a, b)=>{
                let x = a.gender.toLowerCase();
                let y = b.gender.toLowerCase();
                if(x>y){return 1;} 
                if(x<y){return -1;}
                return 0;
              })
            }else{
              users = users.sort((a, b)=>{
                let x = a.gender.toLowerCase();
                let y = b.gender.toLowerCase();
                if(x>y){return -1;} 
                if(x<y){return 1;}
                return 0;
              })
            }
          }
      } else {
        users = users;
      }
    }

    res.json({ users });
  });
  // Serve static files from /browser
  server.get(
    '**',
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: 'index.html',
    })
  );

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
