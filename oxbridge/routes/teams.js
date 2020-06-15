const {Team, validate} = require('../models/teams'); //connects the model to the router and imports the relevant Schema object
const {Sailor} = require('../models/sailors'); //imported for extended validation, would have been straight next in line had we had more time
const {Race} = require('../models/races'); 
const mongoose = require('mongoose');
const express = require('express');
var bodyParser = require('body-parser');
const router = express.Router();

router.get('/', async (req, res) => { //get on the api retrieves all documents in collection
  const teams = await Team.find().sort('name');
  res.send(teams);
});

router.post('/', async (req, res) => { //post creates new document in the collection
  const { error } = validate(req.body); //makes sure packet body is castable to the schema
  if (error) return res.status(400).send(error.details[0].message); //returns the first generated error message if it is not

  let team = new Team({ 
  name: req.body.name,
  status: req.body.status,
  sailors: [{
    sailorName: req.body.sailorName,
    sailorID: req.body.sailorID,
  }],
  races: [{
    raceID: req.body.raceID,
    leaderboard: req.body.leaderboard,
  }],
  });
  team = await team.save();
  
  res.send(team);
});

router.put('/:id', async (req, res) => { //updates information of a team of the given ID
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const team = await Team.findByIdAndUpdate(req.params.id,
    { 
      
  name: req.body.name,
  status: req.body.status,
  sailors: [{
    sailorName: req.body.sailorName,
    sailorID: req.body.sailorID,
  }],
  races: [{
    raceID: req.body.raceID,
    leaderboard: req.body.leaderboard,
  }],
    }, { new: true });

  if (!team) return res.status(404).send('The team with the given ID was not found.');
  
  res.send(team);
});

router.delete('/:id', async (req, res) => { //removes the instance of a team with given ID form the database
  const team = await Team.findByIdAndRemove(req.params.id);

  if (!team) return res.status(404).send('The team with the given ID was not found.');

  res.send(team);
});

router.get('/:id', async (req, res) => { //retrieves the team with the given ID
  const team = await Team.findById(req.params.id);

  if (!team) return res.status(404).send('The team with the given ID was not found.');

  res.send(team);
});

module.exports = router; 