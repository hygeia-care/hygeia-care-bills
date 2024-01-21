var express = require('express');

var router = express.Router();
var Bill = require('../models/bill');
const assuranceService = require('../services/assuranceService');
var debug = require('debug')('bills-2:server');
var verifyJWTToken = require('../verifyJWTToken');


/* GET bills information. */
router.get('/', async function(req, res, next) {

  //console.log("get bill: start");

  try {
    await verifyJWTToken.verifyToken(req, res, next);
  } catch (e){
    console.error(e);
    return true;
  }

  try {
    const result = await Bill.find(); 
    //res.send(result.map((c) => c.cleanup()));
    
    for (const bill of result) {
      if (bill.services != null && bill.services != ""){
        
        var assurance = await assuranceService.getAssurance(bill.services);      

        if (assurance != null && assurance != ""){
          descServices = assurance[0].name + " - email: " + assurance[0].email;
          //console.log("getBill, descServices: " + descServices);
          bill.services = descServices;
        }else{
          descServices = "desconocido";
          //console.log("getBill, descServices: " + descServices);
          bill.services = descServices;
        }        
      }     

    }
    
    res.send(result);

  } catch(e) {    
    res.sendStatus(500);
  }
});



/* POST bills  */
router.post('/', async function(req, res, next) {
  const {name,    description,  total,  services,    issueDate,    patient,    appointment} = req.body;
  //console.log("post bills, body.name: " + req.body.name);
  
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
      await verifyJWTToken.verifyToken(req, res, next);
    } catch (e){
      console.error(e);
      return true;
    }


    try {
      await bill.save();
      //console.log("post bills: after save");
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



/* PUT bills */
router.put('/', async function(req, res, next) {
  const { name, description, total, services, issueDate, patient, appointment, _id } = req.body;

  console.log("inicio put");

  try {
    await verifyJWTToken.verifyToken(req, res, next);
  } catch (e){
    console.error(e);
    return true;
  }

  try {
    const updatedBill = await Bill.findByIdAndUpdate(      
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
      _id,
      { new: true } // Returns the updated document
    );
    

    if (updatedBill) {
          
      const remainingBills = await Bill.find(); // Fetch the remaining bills after deletion

      res.status(200).json({ message: 'Bill successfully updated', remainingBills });
    } else {

      res.status(404).json({ error: 'Bill not found' });
    }
  } catch (error) {
    
    console.error('Error updating bill:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Eliminar una factura por su id
router.delete('/:id', async (req, res,next) => {
  const idBill = req.params.id;

  try {
    await verifyJWTToken.verifyToken(req, res, next);
  } catch (e){
    console.error(e);
    return true;
  }
  
  try {
    //console.log("delete bill, id: " +idBill);

    const result = await Bill.deleteOne({ _id: idBill });             
    if (result.deletedCount > 0) {          
      //console.log ("pasamos por aqui");
      const remainingBills = await Bill.find(); // Fetch the remaining bills after deletion
      //console.log("deepues de recupear todos los bills ")
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
