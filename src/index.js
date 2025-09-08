const express = require('express');
const helmet = require('helmet');
const crypto = require('crypto');
const app = express();

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));

// Sample payment endpoint with security controls
app.post('/api/payments', (req, res) => {
  // HMAC signature verification (security requirement)
  const signature = req.headers['x-stripe-signature'];
  const payload = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Idempotency key check (security requirement)
  const idempotencyKey = req.headers['idempotency-key'];
  if (!idempotencyKey) {
    return res.status(400).json({ error: 'Idempotency key required' });
  }

  // Replay window check (5 minute max - security requirement)
  const timestamp = req.headers['x-timestamp'];
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  if (!timestamp || (now - parseInt(timestamp)) > fiveMinutes) {
    return res.status(400).json({ error: 'Request timestamp outside replay window' });
  }

  res.json({ status: 'success', processed: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
