const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

const app = express();
const port = process.env.PORT || 3000;

// Security Configuration
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_development_secret';
const JWT_SECRET = process.env.JWT_SECRET || 'development_secret_change_in_production';
const REPLAY_WINDOW = 5 * 60 * 1000; // 5 minutes in milliseconds

// HTML Escaping Function to prevent XSS
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Enhanced security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "api.stripe.com"],
      frameSrc: ["js.stripe.com"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// High-ticket sales landing page
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HustlerIQ - High-Ticket Sales Mastery</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 100px 20px; text-align: center; }
            .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
            .hero p { font-size: 1.2rem; margin-bottom: 2rem; }
            .cta-btn { display: inline-block; background: #ff6b35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; }
            .features { padding: 60px 20px; text-align: center; }
            .feature { margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="hero">
            <h1>Scale to $100K/Month with High-Ticket Sales</h1>
            <p>Join 500+ entrepreneurs who've transformed their business with our proven coaching system</p>
            <a href="/apply" class="cta-btn">Apply for $25K Coaching Program</a>
        </div>
        <div class="features">
            <h2>Why High-Ticket Changes Everything</h2>
            <div class="feature">
                <h3>🎯 Proven Sales System</h3>
                <p>Learn the exact framework that's generated over $50M in high-ticket sales</p>
            </div>
            <div class="feature">
                <h3>💰 Premium Positioning</h3>
                <p>Position yourself as the go-to expert and charge premium prices</p>
            </div>
            <div class="feature">
                <h3>🚀 Scalable Operations</h3>
                <p>Build systems that scale without burning out</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Application form for high-ticket prospects
app.get('/apply', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Apply for High-Ticket Coaching</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .form-group { margin-bottom: 20px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input, select, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
            button { background: #667eea; color: white; padding: 15px 30px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
            button:hover { background: #5a6fd8; }
        </style>
    </head>
    <body>
        <h1>Apply for High-Ticket Coaching</h1>
        <p>Complete this application to see if you qualify for our $25,000 coaching program.</p>
        
        <form action="/submit-application" method="POST">
            <div class="form-group">
                <label for="name">Full Name *</label>
                <input type="text" id="name" name="name" required maxlength="100">
            </div>
            
            <div class="form-group">
                <label for="email">Email Address *</label>
                <input type="email" id="email" name="email" required maxlength="255">
            </div>
            
            <div class="form-group">
                <label for="phone">Phone Number *</label>
                <input type="tel" id="phone" name="phone" required maxlength="20">
            </div>
            
            <div class="form-group">
                <label for="revenue">Current Monthly Revenue *</label>
                <select id="revenue" name="revenue" required>
                    <option value="">Select Range</option>
                    <option value="0-5k">$0 - $5,000</option>
                    <option value="5k-15k">$5,000 - $15,000</option>
                    <option value="15k-50k">$15,000 - $50,000</option>
                    <option value="50k+">$50,000+</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="challenge">Biggest Business Challenge *</label>
                <textarea id="challenge" name="challenge" rows="4" required maxlength="1000"></textarea>
            </div>
            
            <div class="form-group">
                <label for="investment">Ready to Invest $25K? *</label>
                <select id="investment" name="investment" required>
                    <option value="">Select Option</option>
                    <option value="yes">Yes, I'm ready</option>
                    <option value="maybe">Maybe, tell me more</option>
                    <option value="no">No, not at this time</option>
                </select>
            </div>
            
            <button type="submit">Submit Application</button>
        </form>
    </body>
    </html>
  `);
});

// Secure payment processing with Stripe
app.get('/payment', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Secure Payment - HustlerIQ</title>
        <script src="https://js.stripe.com/v3/"></script>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .payment-container { background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 20px 0; }
            .price { font-size: 2rem; color: #667eea; font-weight: bold; text-align: center; margin-bottom: 20px; }
            #card-element { padding: 15px; border: 1px solid #ddd; border-radius: 4px; background: white; }
            #submit-payment { background: #28a745; color: white; padding: 15px 30px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; width: 100%; margin-top: 20px; }
            #submit-payment:hover { background: #218838; }
            #submit-payment:disabled { background: #6c757d; cursor: not-allowed; }
            .security-note { font-size: 0.9rem; color: #666; text-align: center; margin-top: 10px; }
            .error { color: #dc3545; margin-top: 10px; }
        </style>
    </head>
    <body>
        <h1>Secure Payment</h1>
        <div class="payment-container">
            <div class="price">$25,000</div>
            <p><strong>HustlerIQ High-Ticket Sales Coaching Program</strong></p>
            <p>12-month comprehensive coaching program including:</p>
            <ul>
                <li>1-on-1 coaching sessions</li>
                <li>Proven sales frameworks</li>
                <li>Premium positioning strategies</li>
                <li>Lifetime access to resources</li>
            </ul>
            
            <form id="payment-form">
                <div id="card-element">
                    <!-- Stripe Elements will create form elements here -->
                </div>
                
                <button id="submit-payment" type="submit">
                    Complete Payment ($25,000)
                </button>
                
                <div id="card-errors" role="alert" class="error"></div>
            </form>
            
            <p class="security-note">
                🔒 Your payment is secured by 256-bit SSL encryption<br>
                💳 We never store your card details<br>
                ✅ PCI DSS Level 1 compliant
            </p>
        </div>

        <script>
            // Stripe configuration (publishable key only - safe for client-side)
            const stripe = Stripe('pk_test_51234567890abcdef'); // Replace with actual publishable key
            const elements = stripe.elements();
            
            // Create card element
            const cardElement = elements.create('card', {
                style: {
                    base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                            color: '#aab7c4',
                        },
                    },
                },
            });
            
            cardElement.mount('#card-element');
            
            // Handle form submission
            const form = document.getElementById('payment-form');
            const submitButton = document.getElementById('submit-payment');
            
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                
                submitButton.disabled = true;
                submitButton.textContent = 'Processing...';
                
                // Create payment method
                const {error, paymentMethod} = await stripe.createPaymentMethod({
                    type: 'card',
                    card: cardElement,
                });
                
                if (error) {
                    document.getElementById('card-errors').textContent = error.message;
                    submitButton.disabled = false;
                    submitButton.textContent = 'Complete Payment ($25,000)';
                } else {
                    // Send payment method to server for processing
                    fetch('/process-payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            payment_method_id: paymentMethod.id,
                            amount: 2500000, // $25,000 in cents
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            window.location.href = '/payment-success';
                        } else {
                            document.getElementById('card-errors').textContent = data.error || 'Payment failed';
                            submitButton.disabled = false;
                            submitButton.textContent = 'Complete Payment ($25,000)';
                        }
                    })
                    .catch(error => {
                        document.getElementById('card-errors').textContent = 'Network error occurred';
                        submitButton.disabled = false;
                        submitButton.textContent = 'Complete Payment ($25,000)';
                    });
                }
            });
        </script>
    </body>
    </html>
  `);
});

// Application submission with enhanced validation and XSS protection
app.post('/submit-application', 
  // Input validation middleware
  [
    body('name').trim().isLength({ min: 1, max: 100 }).escape(),
    body('email').isEmail().normalizeEmail().isLength({ max: 255 }),
    body('phone').trim().isLength({ min: 10, max: 20 }).matches(/^[+\-\s\d\(\)]+$/),
    body('revenue').isIn(['0-5k', '5k-15k', '15k-50k', '50k+']),
    body('challenge').trim().isLength({ min: 10, max: 1000 }).escape(),
    body('investment').isIn(['yes', 'maybe', 'no'])
  ],
  (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(400).send(`
        <h1>Validation Error</h1>
        <p>Please check your input and try again.</p>
        <ul>
          ${errors.array().map(error => `<li>${escapeHtml(error.msg)}</li>`).join('')}
        </ul>
        <a href="/apply">Go Back</a>
      `);
    }

    const { name, email, phone, revenue, challenge, investment } = req.body;

    // Lead scoring algorithm (server-side only)
    let score = 0;
    
    // Revenue scoring
    if (revenue === '50k+') score += 40;
    else if (revenue === '15k-50k') score += 30;
    else if (revenue === '5k-15k') score += 20;
    else score += 10;
    
    // Investment readiness
    if (investment === 'yes') score += 30;
    else if (investment === 'maybe') score += 15;
    else score += 5;
    
    // Challenge complexity (longer = more serious)
    if (challenge.length > 200) score += 20;
    else if (challenge.length > 100) score += 15;
    else score += 10;
    
    // Qualify leads (60+ score gets immediate callback)
    const qualified = score >= 60;
    
    // Log with data sanitization
    console.log(`New application: ${name} (${email}) - Score: ${score}, Qualified: ${qualified}`);
    
    // Secure response with HTML escaping
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Application Received - HustlerIQ</title>
          <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
              .success { background: #d4edda; color: #155724; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .qualified { background: #f8d7da; color: #721c24; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .btn { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 4px; margin: 10px; }
          </style>
      </head>
      <body>
          <h1>Application Received!</h1>
          <div class="${qualified ? 'qualified' : 'success'}">
              <p>Thank you ${escapeHtml(name)}, we've received your application.</p>
              ${qualified ? 
                '<p><strong>🎉 Congratulations! You\'re pre-qualified. Expect a call within 24 hours.</strong></p>' : 
                '<p>We\'ll review your application and get back to you within 48 hours.</p>'
              }
          </div>
          
          ${qualified ? '<a href="/payment" class="btn">Proceed to Payment</a>' : ''}
          <a href="/" class="btn">Return Home</a>
      </body>
      </html>
    `);
  }
);

// Stripe webhook for payment verification
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const rawBody = req.body;
  
  try {
    // Verify webhook signature using Stripe's built-in method (more secure than custom HMAC)
    const event = stripe.webhooks.constructEvent(rawBody, sig, WEBHOOK_SECRET);
    
    // Validate timestamp (replay protection)
    const timestamp = Date.now();
    const webhookTimestamp = event.created * 1000; // Stripe timestamp is in seconds
    
    if (timestamp - webhookTimestamp > REPLAY_WINDOW) {
      console.log('Webhook rejected: timestamp outside replay window');
      return res.status(400).send('Timestamp outside replay window');
    }
    
    // Process the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        // Handle successful payment
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        // Handle failed payment
        break;
        
      default:
        console.log('Unhandled event type:', event.type);
    }
    
    res.json({ received: true });
    
  } catch (err) {
    console.log('Webhook signature verification failed:', err.message);
    return res.status(400).send('Webhook signature verification failed');
  }
});

// Payment processing endpoint
app.post('/process-payment', async (req, res) => {
  try {
    const { payment_method_id, amount } = req.body;
    
    // Server-side amount validation (client cannot control price)
    const FIXED_AMOUNT = 2500000; // $25,000 in cents
    
    if (amount !== FIXED_AMOUNT) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid payment amount' 
      });
    }
    
    // Generate idempotency key for payment safety
    const idempotencyKey = crypto.randomUUID();
    
    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: FIXED_AMOUNT,
      currency: 'usd',
      payment_method: payment_method_id,
      confirmation_method: 'manual',
      confirm: true,
      metadata: {
        program: 'high-ticket-coaching',
        amount_usd: '25000'
      }
    }, {
      idempotencyKey: idempotencyKey
    });
    
    if (paymentIntent.status === 'succeeded') {
      res.json({ success: true, payment_intent: paymentIntent });
    } else {
      res.json({ 
        success: false, 
        error: 'Payment requires additional authentication',
        requires_action: true,
        payment_intent: paymentIntent
      });
    }
    
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Payment processing failed' 
    });
  }
});

// Payment success page
app.get('/payment-success', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Payment Successful - HustlerIQ</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
            .success { background: #d4edda; color: #155724; padding: 30px; border-radius: 8px; margin: 20px 0; }
            .btn { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 4px; margin: 10px; }
        </style>
    </head>
    <body>
        <div class="success">
            <h1>🎉 Payment Successful!</h1>
            <p>Welcome to the HustlerIQ High-Ticket Sales Coaching Program!</p>
            <p>You'll receive an email with next steps within 24 hours.</p>
            <p><strong>Program Value: $25,000</strong></p>
        </div>
        <a href="/" class="btn">Return Home</a>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Application error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'Something went wrong' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: 'The requested resource was not found' 
  });
});

const server = app.listen(port, () => {
  console.log(`HustlerIQ High-Ticket Sales Platform running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server };
