const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const static = require('koa-static');
const proxy = require('koa-proxies');
const app = new Koa();
const router = new Router();
const httpProxy = require('http-proxy');
const wsproxy = httpProxy.createProxyServer();

const HOST = 'localhost:4000';

app.use(views(__dirname + '/views'));
app.use(static(__dirname + '/views'));
app.use(proxy('/api', {
  target: `http://${HOST}`,
  changeOrigin: true
}));

router.get('/', async (ctx, next) => {
  await ctx.render('home');
});

router.get('/vue', async (ctx, next) => {
  await ctx.render('vue');
});

app.use(router.routes()).use(router.allowedMethods());

const server = app.listen(3000, () => {
  console.log(`[${new Date().toLocaleTimeString()}] server is running at port 3000`);
});

server.on('upgrade', (req, socket, head) => {
  wsproxy.ws(req, socket, head, { target: `ws://${HOST}` });
});
