const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://test.api.amadeus.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', 
      },
      onProxyReq: (proxyReq, req, res) => {
        
        proxyReq.setHeader('x-http-method-override', 'GET');
      },
      onError: (err, req, res) => {
        res.status(500).json({
          message: 'Proxy error',
          error: err.message,
        });
      },
    })
  );
};
