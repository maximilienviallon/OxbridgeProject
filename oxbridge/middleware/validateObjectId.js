const mongoose = require('mongoose');

//As base joi doesnt have the proper model for objectID, this is a workaround, which was simply much faster to implement then figuring out the add-on famework or addoption a new one
module.exports = function(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send('Invalid ID.');
  
  next();
}