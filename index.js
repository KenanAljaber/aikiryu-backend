const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db/db');
const { v4: uuidv4 } = require('uuid');
const contactRequestRepository = require('./db/repository/contactRequestRepository');
const adminController = require('./controllers/adminController');
const auth= require('./middleware/authMiddleware.js');

const app = express();
app.use(express.json());
app.use(cors());
app.options('*', cors());

app.listen(process.env.APP_PORT, () => {
    console.log(`Server listening on port ${process.env.APP_PORT || 3001}`);
     db.connect();
});
const adminRoutes= require('./controllers/adminController.js')(express.Router(),auth);
const eventRouter= require('./controllers/eventController.js')(express.Router(),auth);

app.use('/admin',adminRoutes);
app.use('/event',eventRouter);

app.get("/", async (req, res) => {
    console.log("Hello");
    res.status(200).send("Hello");
})

app.post("/contact", async (req, res) => {
    console.log(req.body);
    const contact = req.body;
    const result = await contactRequestRepository.create(contact);
    if(result){
        res.status(200).send(result);
    }else{
        res.status(400).send();
    }
});
