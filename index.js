const express=require('express');
const cors=require('cors');
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors());

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server listening on port ${process.env.PORT || 3001}`);
});

app.post("/contact", (req, res) => {
    console.log(req.body);
    res.send("Hello World!");
});
