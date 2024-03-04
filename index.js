const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db/db');
const router = require('./routes/routes');
const { create } = require('./db/repository/adminRepository');

const app = express();
app.use(express.json());
app.use(cors());
app.options('*', cors());

app.use("/api", router);

app.listen(process.env.APP_PORT, () => {
    console.log(`Server listening on port ${process.env.APP_PORT || 3001}`);
    db.connect().then(() => {

        create();
    })
});

app.get("/", async (req, res) => {
    console.log("Hello");
    res.status(200).send("Hello");
})

