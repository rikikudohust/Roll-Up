const express = require('express');
const mongoose = require('mongoose');

const dbURL = 'mongodb://test:test@localhost:27027/rollup';
const rollUpRouter = require('./src/routes/rollUpRoutes')
mongoose.connect(dbURL);
const database = mongoose.connection;
database.on('error', (error) => {
  console.log(error);
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();
const port = 3000;
app.use(express.json());
app.use(
    express.urlencoded({
        extended : true
    })
);

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});
app.use("/rollup", rollUpRouter);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});