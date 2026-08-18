const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://matchless-celibate-provolone.ngrok-free.dev',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
  );
};