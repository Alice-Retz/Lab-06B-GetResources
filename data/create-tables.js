const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    // move the following under query later
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                );           

                CREATE TABLE buildings (
                  id SERIAL PRIMARY KEY,
                  name VARCHAR(512) UNIQUE NOT NULL
                );

                CREATE TABLE animals (
                    id SERIAL PRIMARY KEY NOT NULL,
                    colors INTEGER NOT NULL,
                    name VARCHAR(512) NOT NULL,
                    building_id INTEGER NOT NULL REFERENCES buildings(id),
                    bought BOOL NOT NULL,
                    days_to_maturity INTEGER NOT NULL,
                    produces VARCHAR(512) NOT NULL,
                    img TEXT NOT NULL,
            );
        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
