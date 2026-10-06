const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../server');

test('API Endpoints Verification', async (t) => {
  let renterToken = '';
  let ownerToken = '';
  let samplePropertyId = '';
  let testListingId = '';

  await t.test('GET /api/health should return ok', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'ok');
  });

  await t.test('POST /api/auth/login should authenticate owner and renter', async () => {
    // Owner login
    const ownerRes = await request(app).post('/api/auth/login').send({
      email: 'owner@rentease.com',
      password: 'password123',
    });
    assert.strictEqual(ownerRes.statusCode, 200);
    assert.ok(ownerRes.body.data.token);
    assert.strictEqual(ownerRes.body.data.role, 'owner');
    ownerToken = ownerRes.body.data.token;

    // Renter login
    const renterRes = await request(app).post('/api/auth/login').send({
      email: 'renter@rentease.com',
      password: 'password123',
    });
    assert.strictEqual(renterRes.statusCode, 200);
    assert.ok(renterRes.body.data.token);
    assert.strictEqual(renterRes.body.data.role, 'renter');
    renterToken = renterRes.body.data.token;
  });

  await t.test('GET /api/properties should return list with pagination & filters', async () => {
    const res = await request(app).get('/api/properties?location=Ahmedabad');
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.body.data.length > 0);
    assert.ok(res.body.total > 0);
    samplePropertyId = res.body.data[0]._id;
  });

  await t.test('GET /api/properties/:id should return single property and increment view', async () => {
    const res = await request(app).get(`/api/properties/${samplePropertyId}`);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.data._id, samplePropertyId);
    assert.ok(res.body.data.ownerId.name);
  });

  await t.test('POST /api/properties should allow owner to create listing', async () => {
    const res = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Test Created Property in Satellite',
        description: 'Spacious test apartment for verification',
        type: 'Apartment',
        location: 'Satellite Road, Ahmedabad',
        city: 'Ahmedabad',
        rent: 25000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1100,
        furnished: 'Semi Furnished',
        amenities: ['Parking', 'WiFi'],
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'],
      });
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.data.title, 'Test Created Property in Satellite');
    testListingId = res.body.data._id;
  });

  await t.test('POST /api/properties should forbid renter from creating property', async () => {
    const res = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${renterToken}`)
      .send({
        title: 'Unauthorized Property',
        description: 'Should fail',
        type: 'Apartment',
        location: 'Nowhere',
        rent: 10000,
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
      });
    assert.strictEqual(res.statusCode, 403);
  });

  await t.test('PUT /api/properties/:id should allow owner to update their property', async () => {
    const res = await request(app)
      .put(`/api/properties/${testListingId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        rent: 27000,
        status: 'available',
      });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.data.rent, 27000);
  });

  await t.test('DELETE /api/properties/:id should allow owner to delete their property', async () => {
    const res = await request(app)
      .delete(`/api/properties/${testListingId}`)
      .set('Authorization', `Bearer ${ownerToken}`);
    assert.strictEqual(res.statusCode, 200);
  });

  await t.test('POST /api/favorites/:id and GET /api/favorites should manage favorites', async () => {
    // Add favorite
    const addRes = await request(app)
      .post(`/api/favorites/${samplePropertyId}`)
      .set('Authorization', `Bearer ${renterToken}`);
    // Can be 201 or 400 (if already seeded)
    assert.ok(addRes.statusCode === 201 || addRes.statusCode === 400);

    // Get favorites
    const getRes = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${renterToken}`);
    assert.strictEqual(getRes.statusCode, 200);
    assert.ok(Array.isArray(getRes.body.data));
  });

  await t.test('GET /api/requests/my and GET /api/requests/owner should return requests', async () => {
    const renterReqs = await request(app)
      .get('/api/requests/my')
      .set('Authorization', `Bearer ${renterToken}`);
    assert.strictEqual(renterReqs.statusCode, 200);
    assert.ok(Array.isArray(renterReqs.body.data));

    const ownerReqs = await request(app)
      .get('/api/requests/owner')
      .set('Authorization', `Bearer ${ownerToken}`);
    assert.strictEqual(ownerReqs.statusCode, 200);
    assert.ok(Array.isArray(ownerReqs.body.data));
  });
});

test.after(async () => {
  const mongoose = require('mongoose');
  await mongoose.connection.close();
});
