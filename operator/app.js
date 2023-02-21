const express = require('express');
const mongoose = require('mongoose');

const dbURL = 'mongodb://test:test@127.0.0.1:27027/rollup';
const userRouter = require('./src/routes/userRoutes')
const transactionRoutes = require('./src/routes/transactionRoutes');
const walletRoutes = require('./src/routes/walletRoutes');
const depositRoutes = require('./src/routes/depositRoutes');
const withdrawRoutes = require('./src/routes/withdrawRoutes');
const cors = require('cors');
mongoose.connect(dbURL);
const database = mongoose.connection;
database.on('error', (error) => {
  console.log(error);
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();
const port = 7000;
app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended : true
    })
);
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});
app.use("/users", userRouter);
app.use("/transactions", transactionRoutes);
app.use("/wallets", walletRoutes);
app.use("/deposit", depositRoutes);
app.use("/withdraw", withdrawRoutes)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});