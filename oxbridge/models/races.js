const Joi = require('joi');
const mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi)

const Race = mongoose.model('Race', new mongoose.Schema({
  //whereas it is expected that any new race will be able to have at least some date around which said event could be held
  dateStart: {
    type: mongoose.Schema.Types.Date,
    required: true,
  },
  //finishing date is expected to be touched upon mostly through put calls
  dateFinish: { 
    type: mongoose.Schema.Types.Date, 
  },
  status: {
    type: String,
    default: "Scheduled", //to differentiate between past, ongoing and future races without unnecesary querying
    maxlength: 255
  },
  teams: [{ //every race can be attended by many teams, all of which have id (courtesy of mongo) and possible position
    teamID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teams'
    },
    leaderboard: {
        type : mongoose.Schema.Types.Number,
        default: 9999,
    },
  }],
  info: { // wanted to try what mongoDB has to offer and I actually like the idea behind embedded documents
    name: {
        type: String,
        maxlength: 255
    },
    location: {
        type : String,
        maxlength: 255
    },
    description: {
      type : String,
      maxlength: 1024
    },
  },
}));

function validateRace(race) {
  const schema = {
    dateStart: Joi.date().required(),
    dateFinish: Joi.date(),
    status: Joi.string().max(255),
    teams: Joi.array().items(Joi.object().keys({ //not gonna lie, the inner workings of this have caused me some wrinkles
      teamID: Joi.any(), //placeholder, sadly not removed nor fixed
      leaderboard: Joi.number()
    })),
    name: Joi.string().max(255),
    location: Joi.string().max(255),
    description: Joi.string().max(1024), //I dont like having the minimum requirements, always imagine somone using some obscure rowing abbreviation
  };

  return Joi.validate(race, schema);
}

exports.Race = Race; 
exports.validate = validateRace;