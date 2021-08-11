const client = require('../lib/client');
// import our seed data:
const animals = require('./animals.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    // await Promise.all(
    //   usersData.map(user => {
    //     return client.query(`
    //                   INSERT INTO users (email, hash)
    //                   VALUES ($1, $2)
    //                   RETURNING *;
    //               `,
    //     [user.email, user.hash]);
    //   })
    // );
      

    await Promise.all(
      animals.map(animal => {
        return client.query(`
                    INSERT INTO animals (name, building, bought, days_to_maturity, produces)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [animal.name, animal.building, animal.bought, animal.days_to_maturity, animal.produces]);
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
