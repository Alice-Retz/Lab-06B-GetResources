const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this protected route, we get the user's id like so: ${req.animalsId}`
  });
});


app.get('/buildings', async (req, res) => {
  try{
    const data = await client.query('SELECT * FROM buildings;');
    res.json(data.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/animals', async(req, res) => {
  try {
    const data = await client.query(
      ` SELECT animals.id,
      animals.name,
      animals.colors,
      animals.bought,
      animals.days_to_maturity,
      animals.produces,
      animals.img,
      buildings.name AS building
      FROM animals INNER JOIN buildings
      ON animals.building_id = buildings.id
      ORDER BY animals.id
      ;`
    );
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/animals/:animalid', async(req, res) => {
  const animalid = req.params.animalid;
  try {
    const data = await client.query(
      `SELECT animals.id,
      animals.name,
      animals.colors,
      animals.bought,
      animals.days_to_maturity,
      animals.produces,
      animals.img,
      buildings.name AS building
      FROM animals INNER JOIN buildings
      ON animals.building_id = buildings.id
      WHERE animals.id = $1
      ;`,
      [animalid]
    );
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/animals', async(req, res) => {

  try {
    const data = await client.query(`
    INSERT INTO animals(
      name,
      colors,
      building_id,
      bought,
      days_to_maturity,
      produces,
      img
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;`, [
      req.body.name,
      req.body.colors,
      req.body.building_id,
      req.body.bought,
      req.body.days_to_maturity,
      req.body.produces,
      req.body.img,
    ]);
    res.json(data.rows[0]);
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});

app.put('/animals/:id', async(req, res)=>{
  try {
    const data = await client.query(`
      UPDATE animals
      SET 
        name=$2,
        colors=$3,
        building_id=$4,
        bought=$5,
        days_to_maturity=$6,
        produces=$7,
        img=$8
      WHERE id = $1
      RETURNING *;
    `, [
      req.params.id,
      req.body.name,
      req.body.colors,
      req.body.building_id,
      req.body.bought,
      req.body.days_to_maturity,
      req.body.produces,
      req.body.img
    ]);
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/animals/:id', async(req, res) => {

  try {
    const data = await client.query(`
    INSERT INTO animals(
      name,
      colors,
      building_id,
      bought,
      days_to_maturity,
      produces,
      img
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;`, [
      req.body.name,
      req.body.colors,
      req.body.building_id,
      req.body.bought,
      req.body.days_to_maturity,
      req.body.produces,
      req.body.img
    ]);
    res.json(data.rows[0]);
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});

app.delete('/animals/:id', async (req, res) => {
  try {
    const data = await client.query(`
    DELETE FROM animals WHERE id=$1
    RETURNING *;`, [
      req.params.id
    ]);
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});




app.use(require('./middleware/error'));

module.exports = app;
