const {Sailor, validate} = require('../models/sailors'); //connects the model to the router and imports the relevant Schema object
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router(); //for the proper web feeling, works with URLs

router.get('/', async (req, res) => { //get on the api retrieves all documents in collection
  const sailors = await Sailor.find().sort('name');
  res.send(sailors);
});

router.post('/', async (req, res) => { //post creates new document in the collection
  const { error } = validate(req.body); //makes sure packet body is castable to the schema
  if (error) return res.status(400).send(error.details[0].message); //returns the first generated error message if it is not

  let sailor = new Sailor({ 
    name: req.body.name, //take the atribute name from the body of the request and passes it into the name variable of the new instance of the Sailor
    mail: req.body.mail,
    password: req.body.password,
    tracking: req.body.tracking,
    AccStatus: req.body.AccStatus,
    teamID: req.body.teamID,
  });
  sailor = await sailor.save(); //which is then created in the database as a new document
  
  res.send(sailor); //and user recieves a responce containing the saved sailor
});

router.put('/:id', async (req, res) => { //updates information of a sailor of the given ID
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const sailor = await Sailor.findByIdAndUpdate(req.params.id,
    { 
    name: req.body.name,
    mail: req.body.mail,
    password: req.body.password,
    tracking: req.body.tracking,
    AccStatus: req.body.AccStatus,
    teamID: req.body.teamID,
    }, { new: true });

  if (!sailor) return res.status(404).send('The sailor with the given ID was not found.');
  
  res.send(sailor); //returns the last peek, at what is no more
});

router.delete('/:id', async (req, res) => { //removes the instance of a sailor with given ID form the database
  const sailor = await Sailor.findByIdAndRemove(req.params.id);

  if (!sailor) return res.status(404).send('The sailor with the given ID was not found.');

  res.send(sailor);
});

router.get('/:id', async (req, res) => { //retrieves the sailor with the given ID
  const sailor = await Sailor.findById(req.params.id);

  if (!sailor) return res.status(404).send('The sailor with the given ID was not found.');

  res.send(sailor);
});

module.exports = router; 