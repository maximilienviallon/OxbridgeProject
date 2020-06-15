const Joi = require('joi');
const mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi)

const Coordinate = mongoose.model('Coordinate', new mongoose.Schema({
    // the idea behind this schema is that for single unique teamID-raceID-sailorID combination there would be single document with all the tracking info in an array
    tracker: [{ 
        coordinateX: {
            type: mongoose.Schema.Types.Number,
            
            required: true,
        },
        coordinateY: {
            type: mongoose.Schema.Types.Number,
            required: true,
        },
        time: {
            type: mongoose.Schema.Types.Date,
            default: Date.now //sensible thing to expect, if I ever encpuntered one
        }
    }],
    teamID: {
        type: mongoose.Schema.Types.ObjectId, //this would be fully redundant in relational database however, thats where we are not 
        ref: 'teams',
        required: true,
    },
    raceID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'races',
        required: true,
    },
    sailorID: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'sailors',
        required: true,
    }

}));

function validateCoordinates(coordinate) {
    const schema = {
        tracker: Joi.array().items(Joi.object().keys({
            coordinateX: Joi.Number().required(),
            coordinateY: Joi.Number().required(),
            time: Joi.date(),
        })),
        teamID: Joi.any().required(),
        raceID: Joi.any().required(),
        sailorID: Joi.any().required(), //really sad I am eaving these like this, however with the base joi not supporting these, other things pushed past in the prio queue
    };

    return Joi.validate(coordinate, schema);
}

exports.Coordinate = Coordinate;
exports.validate = validateCoordinates;