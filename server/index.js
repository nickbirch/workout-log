require('dotenv').config()

const express = require('express');
const app = express();
const sequelize = require('./db');
sequelize.sync();
app.use(express.json());


app.use(require('./middleware/headers'));

const user = require('./controllers/user-controller');
app.use('/user', user);

const log = require('./controllers/log-controller');
app.use('/log', log);


app.listen(process.env.PORT, () => {console.log(`App is listening on port ${process.env.PORT}`)});