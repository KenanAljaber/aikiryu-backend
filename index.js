const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db/db');
const { v4: uuidv4 } = require('uuid');
const repository = require('./db/repository');

const app = express();
app.use(express.json());
app.use(cors());


app.listen(process.env.PORT || 3001, async () => {
    console.log(`Server listening on port ${process.env.PORT || 3001}`);
    await db.connect();
});

app.post("/contact", async (req, res) => {
    console.log(req.body);
    const contact = req.body;
    const result = await repository.create(contact);
    if(result){
        res.status(200).send(result);
    }else{
        res.status(400).send();
    }
});
