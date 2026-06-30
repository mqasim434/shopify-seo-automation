require('dotenv').config();

const express = require('express');
const webhookRouter = require('./routes/webhook');
const { installHandler, callbackHandler } = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Fix URLs like //webhook/product-created (trailing slash on ngrok URL + path)
app.use((req, res, next) => {
  if (req.url.includes('//')) {
    req.url = req.url.replace(/\/{2,}/g, '/');
  }
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/auth/install', installHandler);
app.get('/auth/callback', callbackHandler);

app.use(
  '/webhook',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} (${req.body?.length || 0} bytes)`
    );
    next();
  },
  webhookRouter
);

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const server = app.listen(PORT, () => {
  console.log(`Shopify SEO automation server running on port ${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/webhook/product-created`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} is already in use by another process.`);
    console.error('Kill it first, then restart:');
    console.error(`  netstat -ano | findstr :${PORT}`);
    console.error('  taskkill /PID <pid> /F\n');
  } else {
    console.error('Server failed to start:', err.message);
  }
  process.exit(1);
});
