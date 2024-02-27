const { v4: uuidv4 } = require('uuid');
const contactRequestRepository = require('../db/repository/contactRequestRepository.js');
const adminController = require('../controllers/adminController.js');
const auth= require('../middleware/authMiddleware.js');


const express = require('express');
const router = express.Router();

const adminRoutes= require('.././controllers/adminController.js')(router,auth);
const eventRouter= require('.././controllers/eventController.js')(router,auth);

router.use('/admin',adminRoutes);
router.use('/event',eventRouter);

router.post("/contact", async (req, res) => {
    console.log(req.body);
    const contact = req.body;
    const result = await contactRequestRepository.create(contact);
    if(result){
        res.status(200).send(result);
    }else{
        res.status(400).send();
    }
});


module.exports = router;