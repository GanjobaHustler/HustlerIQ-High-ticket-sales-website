const request = require('supertest');
const app = require('./index');

describe('HustlerIQ Sales Website', () => {
  test('should require valid payment signature', async () => {
    const response = await request(app)
      .post('/api/payments')
      .send({ amount: 1000 })
      .expect(401);
    
    expect(response.body.error).toBe('Invalid signature');
  });

  test('should require idempotency key', async () => {
    const response = await request(app)
      .post('/api/payments')
      .set('x-stripe-signature', 'valid-signature')
      .send({ amount: 1000 })
      .expect(400);
    
    expect(response.body.error).toBe('Idempotency key required');
  });
});
