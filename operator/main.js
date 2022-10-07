const mongoose = require('mongoose');

const dbURL = 'mongodb://test:test@localhost:27026/rollup';
const rollUpRouter = require('./src/routes/rollUpRoutes')
mongoose.connect(dbURL);
const database = mongoose.connection;
database.on('error', (error) => {
  console.log(error);
})

database.once('connected', () => {
    console.log('Database Connected');
})

module.exports = database;