const {Coordinate, validate} = require('../models/coordinates'); //connects the model to the router and imports the relevant Schema object
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => { //get on the api retrieves all documents in collection
  const coordinates = await Coordinate.find().sort('name');
  res.send(coordinates);
});

router.post('/', async (req, res) => { //post creates new document in the collection
  const { error } = validate(req.body); //makes sure packet body is castable to the schema
  if (error) return res.status(400).send(error.details[0].message); //returns the first generated error message if it is not

  let coordinate = new Coordinate({ 
    tracker: [{
      coordinateX: req.body.coordinateX,
      coordinateY: req.body.coordinateY,
      time: req.body.time,
  }],
  teamID: req.body.teamID,
  raceID: req.body.raceID,
  sailorID: req.body.sailorID,
  });
  coordinate = await coordinate.save();
  
  res.send(coordinate);
});

router.put('/:id', async (req, res) => {  //updates information of a coordinate of the given ID
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const coordinate = await Coordinate.findByIdAndUpdate(req.params.id,
    { 
      tracker: [{
        coordinateX: req.body.coordinateX,
        coordinateY: req.body.coordinateY,
        time: req.body.time,
    }],
    teamID: req.body.teamID,
    raceID: req.body.raceID,
    sailorID: req.body.sailorID,
    }, { new: true });

  if (!coordinate) return res.status(404).send('The coordinate with the given ID was not found.');
  
  res.send(coordinate);
});

router.delete('/:id', async (req, res) => { //removes the instance of a coordinate with given ID form the database
  const coordinate = await Coordinate.findByIdAndRemove(req.params.id);

  if (!coordinate) return res.status(404).send('The coordinate with the given ID was not found.');

  res.send(coordinate);
});

router.get('/:id', async (req, res) => { //retrieves the coordinate with the given ID
  const coordinate = await Coordinate.findById(req.params.id);

  if (!coordinate) return res.status(404).send('The coordinate with the given ID was not found.');

  res.send(coordinate);
});

module.exports = router; 