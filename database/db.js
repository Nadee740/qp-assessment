const { Pool } = require('pg')
const pool=new Pool({
    user:"postgres",
    password:"11092002",
    host:"localhost",
    port:5432,
    database:"grocerydb",

})


module.exports={pool}