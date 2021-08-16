require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

const buildingData = require('../data/buildings.js');

describe('building routes', () => {
  
  beforeAll(async () => {
    execSync('npm run setup-db');
  
    await client.connect();
    // const signInData = await fakeRequest(app)
    //   .post('/auth/signup')
    //   .send({
    //     email: 'jon@user.com',
    //     password: '1234'
    //   });
      
    // token = signInData.body.token; // eslint-disable-line
  }, 10000);
  
  afterAll(done => {
    return client.end(done);
  });

  test('GET /buildings returns list of buildings', async() => {
    const expected = buildingData.map(build=>build.name);
    const data = await fakeRequest(app)
      .get('/buildings')
      .expect('Content-Type', /json/)
      .expect(200);
      
    const buildingNames = data.body.map(build => build.name);
      
    expect(buildingNames).toEqual(expected);
    expect(buildingNames.length).toBe(buildingNames.length);
    expect(data.body[0].id).toBeGreaterThan(0);
      
  });
});