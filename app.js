const express=require('express')
const app=express()
const bodyParser = require('body-parser');
const cors = require("cors");
app.use(bodyParser.json());
const adminRoute=require('./routes/admin')
const userRoute=require('./routes/users')

const corsOptions = {
  origin: ['*'],
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const port=8080;


app.use('/api/v1/admin',adminRoute)

app.use('/api/v1/user',userRoute)

app.listen(port, async () => {

    console.log(`App listening on port ${port}`);
  });