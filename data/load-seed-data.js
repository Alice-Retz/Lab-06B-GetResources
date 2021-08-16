const client = require('../lib/client');
// import our seed data:
const animals = require('./animals.js');
const buildingsData = require('/buildings.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      buildingsData.map(buildings => {
        return client.query(`
                      INSERT INTO buildings (name)
                      VALUES ($1)
                      RETURNING *;
                  `,
        [buildings.name]);
      })
    );
      

    await Promise.all(
      animals.map(animal => {
        return client.query(`
                    INSERT INTO animals (
                      name, 
                      building_id, 
                      bought, 
                      days_to_maturity, 
                      produces)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [animal.name, 
          animal.building, 
          animal.bought, 
          animal.days_to_maturity, 
          animal.produces]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
