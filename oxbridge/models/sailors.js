const Joi = require('joi');
const mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi)

//schema for the "Sailor" collection in the DB
const Sailor = mongoose.model('Sailor', new mongoose.Schema({
  name: { //everyone has got to have one
    type: String,
    required: true, //as such it is required and no record shall be entered in our DB without having a valid name
    minlength: 5,
    maxlength: 255
  },
  mail: { //would have been pripary key if this was meant to go into relational database
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  password: { //sadly left in plain as I had some, as of now unexplained, issues with the most common hashing frameworks
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  tracking: { //boolean to tag user as being curently recording their position in the database as a representative of their team
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
  AccStatus: {
    type: String,
    default: "participant", //to be used as a permission tier
    maxlength: 255
  },
  teamID: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'sailors',
    //this refference allows us to better tie in different collection and allow us simpler querying when it comes to retrieving relevant data 
  },
}));

function validateSailor(sailor) { //this function takes a schema and tries to fit the data retrieved from json object and cast them in
  const schema = {
    name: Joi.string().min(5).max(255).required(),
    mail: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
    AccStatus: Joi.string().max(255),
    tracking: Joi.boolean(),
    teamID: Joi.any() //sadly ran out of time before I managed to utilize the  joi-objectid framework add-on
  };

  return Joi.validate(sailor, schema); //if this fails then process is going to be interupted and no data will be manipulated with
}

exports.Sailor = Sailor; 
exports.validate = validateSailor; //exports are important as without these would be accessible outside of this scope