const Joi = require('joi');
const mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi)

const Team = mongoose.model('Team', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 255
  },
  status: { // in current version not used at all, our plans in regards to the Teams implementation have changed around a lot
    type: String,
    default: "open",
    maxlength: 255
  },
  sailors: [{
    sailorName: {
        type: String,
        required: function(){ //I loved that this is a thing, making one attribute require,d but only if another is present in the request
            return this.IDs? true : false 
        },
        minlength: 5,
        maxlength: 255
    },
    sailorID: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'sailors',
    },
  }],
  races: [{
    raceID: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'races',
    },
    leaderboard: { //might seem odd, but it was expected that race would be added to the team document only after it was finished and thus guaranteeing sensible value here
      type: mongoose.Schema.Types.Number,
      required: function(){
        return this.raceIDs? true : false 
    },
    },
  }],
}));

function validateTeam(team) {
  const schema = {
    name: Joi.string().max(255).required(),
    status: Joi.string().max(255),
    sailors: Joi.array().items(Joi.object().keys({
      sailorName: Joi.string().min(5).max(255),
      sailorID: Joi.any()
    })),
    races: Joi.array().items(Joi.object().keys({
      raceID: Joi.any(),
      leaderboard: Joi.number()
    })),
  };

  return Joi.validate(team, schema);
}

exports.Team = Team; 
exports.validate = validateTeam;