const {Race, validate} = require('../models/races'); //connects the model to the router and imports the relevant Schema object
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => { //get on the api retrieves all documents in collection
  const races = await Race.find().sort('name');
  res.send(races);
});

router.post('/', async (req, res) => { //post creates new document in the collection
  const { error } = validate(req.body); //makes sure packet body is castable to the schema
  if (error) return res.status(400).send(error.details[0].message); //returns the first generated error message if it is not

  let race = new Race({ 
    dateStart: req.body.dateStart,
    dateFinish: req.body.dateFinish,
    status: req.body.status,
    teams: [{
      teamID: req.body.teamID,
      leaderboard: req.body.leaderboard,
    }],
    info: {
      name: req.body.name,
      location: req.body.location,
      description: req.body.description,
    },
  });
  race = await race.save();
  
  res.send(race);
});

router.put('/:id', async (req, res) => { //updates information of a race of the given ID
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const race = await Race.findByIdAndUpdate(req.params.id,
    { 
      dateStart: req.body.dateStart,
    dateFinish: req.body.dateFinish,
    status: req.body.status,
    teams: [{
      teamID: req.body.teamID,
      leaderboard: req.body.leaderboard,
    }],
    info: {
      name: req.body.name,
      location: req.body.location,
      description: req.body.description,
    },
    }, { new: true });

  if (!race) return res.status(404).send('The race with the given ID was not found.');
  
  res.send(race);
});

router.delete('/:id', async (req, res) => { //removes the instance of a race with given ID form the database
  const race = await Race.findByIdAndRemove(req.params.id);

  if (!race) return res.status(404).send('The race with the given ID was not found.');

  res.send(race);
});

router.get('/:id', async (req, res) => { //retrieves the race with the given ID
  const race = await Race.findById(req.params.id);

  if (!race) return res.status(404).send('The race with the given ID was not found.');

  res.send(race);
});

module.exports = router; 