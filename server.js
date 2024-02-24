import express from "express";
import fs from "fs/promises";
import path from "path";
import http from "http";
import chokidar from "chokidar";
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({
  server,
});

/** @type {WebSocket} */
let socket;

wss.on("connection", (_ws) => {
  console.log("Client connected");
  socket = _ws;
});

const watcher = chokidar.watch("./src/**/*.js");
watcher.on("change", (file) => {
  socket?.send(
    JSON.stringify({
      type: "file:changed",
      file,
    })
  );
});

/** @type {import("express").Handler} */
const hmrMiddleware = async (req, res, next) => {
  if (!req.url.endsWith(".js")) {
    return next();
  }

  const client = await fs.readFile(path.join(process.cwd(), "client.js"));
  let content = await fs.readFile(path.join(process.cwd(), req.url));
  content = `
  ${client}

  import.meta.file = "${req.url.slice(1)}"
  hmrClient(import.meta)

  ${content}`;

  res.type(".js");
  res.send(content);
};

app.use(hmrMiddleware);
app.use(express.static(process.cwd()));

server.listen(8080, () => console.log("Listening on 8080"));
