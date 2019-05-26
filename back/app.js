const http = require('http');

const WebSocket = require('ws');
const Koa = require('koa');
const Router = require('koa-router');

const socketHandler = require('./src/socket');

const app = new Koa();
const router = new Router();

router.get('/ping', (ctx) => {ctx.body = 'OK';});
app.use(router.routes());

const state = {
  rooms: [],
  users: []
};
const server = http.createServer(app.callback());
const wss = new WebSocket.Server({server});

socketHandler(wss, state);

module.exports = server;
