var express = require('express');

var router = express.Router();
var Bill = require('../models/bill');
const assuranceService = require('../services/assuranceService');
var debug = require('debug')('bills-2:server');


/*
var bodyParser = require('body-parser');
express.use(bodyParser.json());
*/

/* GET bills listing.
router.get('/', function(req, res, next) {
  res.send(' bills - respond with a resource');
});


/* GET bills information. */
/*
router.get('/', async function(req, res, next) {

  console.log("get bill: start");

  try {
    const result = await Bill.find();
    //console.log("get bill: after find");
    //res.send(result.map((c) => c.cleanup()));
    res.send(result);

    //llamada a ASSURANCE 
    var assurance = await assuranceService.getAssurance("65a50a080523a489d6f56e7f");
    console.log("log de la respuesta a assuranceService: " , assurance);

  } catch(e) {
    // debug("DB problem - get Bill", e);
    //console.error(e);
    res.sendStatus(500);
  }
});
*/

/* GET bills information. */
router.get('/', async function(req, res, next) {

  console.log("get bill: start");

  try {
    const result = await Bill.find();
    //console.log("get bill: after find");
    //res.send(result.map((c) => c.cleanup()));
    
    for (const bill of result) {
      if (bill.services != null && bill.services != ""){
        
        var assurance = await assuranceService.getAssurance(bill.services);      

        if (assurance != null && assurance != ""){
          descServices = assurance[0].name + " - email: " + assurance[0].email;
          console.log("getBill, descServices: " + descServices);
          bill.services = descServices;
        }else{
          descServices = "desconocido";
          console.log("getBill, descServices: " + descServices);
          bill.services = descServices;
        }        
      }     

    }
    
    res.send(result);

  } catch(e) {
    // debug("DB problem - get Bill", e);
    //console.error(e);
    res.sendStatus(500);
  }
});



/* POST bills  */
router.post('/', async function(req, res, next) {
  const {name,    description,  total,  services,    issueDate,    patient,    appointment} = req.body;
  console.log("post bills: start" + req.body);
  
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


/* PUT bills  */
/*
router.put('/', async function(req, res, next) {
  const {name,    description,  total,  services,    issueDate,    patient,    appointment} = req.body;
  console.log("PUT bills: start");
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
    console.log("PUT bills: before save" + bill);
    await bill.save();
    console.log("PUT bills: after save");
    return res.sendStatus(201);
  } catch (e) {
    if (e.errors) {  
      

      // Error de validación (400 - Bad Request)
      if (e.name === 'ValidationError') {        
        res.status(400).send({error: e.message});
      }


    } else {
      debug("DB problem - post bills", e);
      res.sendStatus(500);
    }
  

  }
});
*/
/* PUT bills */
router.put('/', async function(req, res, next) {
  const { name, description, total, services, issueDate, patient, appointment, _id } = req.body;

  try {
    const updatedBill = await Bill.findByIdAndUpdate(
      _id,
      {
        name,
        description,
        total,
        services,
        issueDate,
        patient,
        appointment,
        _id
      },
      { new: true } // Returns the updated document
    );


    if (updatedBill) {
      console.log("PUT bills: bill ID ${updatedBill.id} successfully updated");
      
      const remainingBills = await Bill.find(); // Fetch the remaining bills after deletion

      res.status(200).json({ message: 'Bill successfully updated', remainingBills });
    } else {
      console.log("PUT bills: bill ID ${_id} not found");
      res.status(404).json({ error: 'Bill not found' });
    }
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Eliminar una factura por su id
router.delete('/:id', async (req, res) => {
  const idBill = req.params.id;
  
  try {
    console.log("delete bill, id: " +idBill);
    const result = await Bill.deleteOne({ _id: idBill });         
    if (result.deletedCount > 0) {
      //res.status(200).json({ message: 'Bill successfully deleted' });
      
      const remainingBills = await Bill.find(); // Fetch the remaining bills after deletion
      res.status(200).json({ message: 'Bill successfully deleted', remainingBills });
      
    } else {
      res.status(404).json({ error: 'Bill not found'});
    }
  } catch (e) {
    if (e.errors) {
      debug("Validation problem when saving");
      res.status(400).send({error: e.message});
    } else {
      console.log("DB problem - delete bills", e);
      res.sendStatus(500);
    }
  }

  
});


module.exports = router;
