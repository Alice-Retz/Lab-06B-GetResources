require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const animalData = require('../data/animals.js');

describe('app routes', () => {
  describe('routes', () => {
    // let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      //   const signInData = await fakeRequest(app)
      //     .post('/auth/signup')
      //     .send({
      //       email: 'jon@user.com',
      //       password: '1234'
      //     });
      
      //   token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('GET returns animals', async ()=> {

      const expectation = animalData.map(animals => animals.building);

      const data = await fakeRequest(app)
        .get('/animals')
        .expect('Content-Type', /json/)
        .expect(200);

      const building = data.body.map(animals => animals.building);
      
      expect(building).toEqual(expectation);
      expect(building.length).toEqual(animalData.length);
    });
      
    test('GET /animals/:id returns individual animal', async ()=> {

      const expectation = animalData[0];
      expectation.id = 1;

      const data = await fakeRequest(app)
        .get('/animals/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);

    });  
      
    test('POST /animals creates a new entry', async ()=> {

      const newAnimal = {
        name: 'dog',
        building: 'farmhouse',
        bought: false,
        days_to_maturity: 0,
        produces: 'love',
      };

      const data = await fakeRequest(app)
        .post('/animals')
        .send(newAnimal)
        .expect(200)
        .expect('Content-Type', /json/);
        
      expect(data.body.name).toEqual(newAnimal.name);
      expect(data.body.id).toBeGreaterThan(0);

    });  

    test('PUT /animals/:id updates animals', async ()=>{
      const updatedData =   {
        name: 'duck',
        building: 'pond',
        bought: true,
        days_to_maturity: 5,
        produces: 'duck feather',
      };
      const data = await fakeRequest(app)
        .put('/animals/2')
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /json/);
  
      expect(data.body.building).toEqual(updatedData.building);
      expect(data.body.produces).toEqual(updatedData.produces);
  
    });
  });
});