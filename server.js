const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//const PORT = 3000;
const PORT = process.env.PORT || 3000;
//import the routing files

const userRoutes = require('./models/routes/userRoutes');
const candidateRoutes = require('./models/routes/candidateRoutes')
    //use the routers
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(PORT, () => {
    console.log('Listening on port 3000');
})