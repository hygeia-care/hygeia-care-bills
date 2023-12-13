var express = require('express');
var router = express.Router();
var Bill = require('../models/bill');
var debug = require('debug')('bills-2:server');

/* GET bills listing.
router.get('/', function(req, res, next) {
  res.send(' bills - respond with a resource');
});


/* GET bills information. */
router.get('/', async function(req, res, next) {

  console.log("get bill: start");

  try {
    const result = await Bill.find();
    console.log("get bill: after find");
    //res.send(result.map((c) => c.cleanup()));
    res.send(result);

  } catch(e) {
    // debug("DB problem - get Bill", e);
    console.error(e);
    res.sendStatus(500);
  }
});


/* POST bills  */
router.post('/', async function(req, res, next) {
  const {name,    description,  total,  services,    issueDate,    patient,    appointment} = req.body;
  console.log("post bills: start");
  const bill = new Bill({
    name,
    description,
    total,
    services,
    issueDate,
    patient,
    appointment

  });
  try {
    await bill.save();
    console.log("post bills: after save");
    return res.sendStatus(201);
  } catch (e) {
    if (e.errors) {
      debug("Validation problem when saving");
      res.status(400).send({error: e.message});
    } else {
      debug("DB problem - post bills", e);
      res.sendStatus(500);
    }
  }
});


module.exports = router;
