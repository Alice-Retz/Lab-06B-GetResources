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

      const expectation = animalData.map(animals => animals.name);
      const expectedShape = {
        id: 1,
        name: 'chicken',
        colors: 3,
        building: 'coop',
        bought: true,
        days_to_maturity: 3,
        produces: 'egg',
        img: 'https://stardewvalleywiki.com/mediawiki/images/f/fd/Brown_Chicken.png'
      };

      const data = await fakeRequest(app)
        .get('/animals')
        .expect('Content-Type', /json/)
        .expect(200);

      const names = data.body.map(animals => animals.name);
      
      expect(names).toEqual(expectation);
      expect(names.length).toEqual(animalData.length);
      expect(data.body[0]).toEqual(expectedShape);
    }, 10000);
      
    test('GET /animals/:id returns individual animal', async ()=> {

      const expectation = {
        id: 1,
        name: 'chicken',
        colors: 3,
        building: 'coop',
        bought: true,
        days_to_maturity: 3,
        produces: 'egg',
        img: 'https://stardewvalleywiki.com/mediawiki/images/f/fd/Brown_Chicken.png'
      };

      const data = await fakeRequest(app)
        .get('/animals/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);

    });  
      
    test('POST /animals creates a new entry', async ()=> {

      const newAnimal = {
        name: 'dog',
        colors: 3,
        building_id: 4,
        bought: false,
        days_to_maturity: 0,
        produces: 'love',
        img: 'dog.png'
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
        colors: 1,
        building_id: 3,
        bought: true,
        days_to_maturity: 5,
        produces: 'duck feather',
        img: 'https://stardewvalleywiki.com/mediawiki/images/3/38/Duck.png'
      };
      const data = await fakeRequest(app)
        .put('/animals/2')
        .send(updatedData)
        // .expect(200)
        .expect('Content-Type', /json/);
  
      expect(data.body.building).toEqual(updatedData.building);
      expect(data.body.produces).toEqual(updatedData.produces);
  
    });

    test('POST /animals/:id creates a new animal', async ()=>{

      const newAnimal = {
        name: 'dog',
        colors: 3,
        building_id: 4,
        bought: false,
        days_to_maturity: 0,
        produces: 'love',
        img: 'dog.png'
      };

      const data = await fakeRequest(app)
        .post('/animals/1')
        .send(newAnimal)
        .expect(200)
        .expect('Content-Type', /json/);
        
      expect(data.body.name).toEqual(newAnimal.name);
      expect(data.body.id).toBeGreaterThan(0);

    });
    
    test('DELETE /animals/:id deletes animal', async ()=>{
      
      const deletedObject = {
        name: 'dog',
        colors: 3,
        building_id: 4,
        bought: false,
        days_to_maturity: 0,
        produces: 'love',
        img: 'dog.png'
      };
      
      await fakeRequest(app)
        .post('/animals')
        .send(deletedObject)
        .expect('Content-Type', /json/);

      const data = await fakeRequest(app)
        .delete('/animals/12')
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(data.body).toEqual({ ...deletedObject, id:12 });
    }); 
  });
});