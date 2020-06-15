const Joi = require('joi'); //framwork for validation of input
Joi.objectId = require('joi-objectid')(Joi); //unused framework addon
const mongoose = require('mongoose'); //framework for connecting to MongoDB and working with the proper datatypes in and out of schemas
const coordinates = require('./routes/coordinates'); 
const races = require('./routes/races');
const sailors = require('./routes/sailors');
const teams = require('./routes/teams');
const express = require('express');
const app = express(); 

//promise to connect to provided MongoDB database with scenarios for both outcomes
mongoose.connect('mongodb+srv://admin:admin@cluster-frag-o0olt.azure.mongodb.net/oxbridge?retryWrites=true&w=majority')
//and yes, I am fully aware that both name and pass should be enviromental variables
//but this is simpler for you, so I kept it this way :)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/coordinates', coordinates);
app.use('/api/races', races);
app.use('/api/sailors', sailors);
app.use('/api/teams', teams);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
//setting up the port for localhost communication and usage of preset enviromental variable