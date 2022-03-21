const express = require("express");
const app = express();
const cors = require('cors');
const connect = require('./db/database');
require("dotenv").config();
const router = require("./routes/route");
const errorHandler = require("./middleware/errorHandler");

 
app.use("/v1/api/", express.static("./public")); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//app.use(errorHandler);

app.use("/v1/api/fruits", router);
 



const port = 3045 || process.env.PORT

const start = async() => {
    try { 
        await connect(process.env.MONGO_URI);
        app.listen(port, () => {
          console.log(`Server listening is port ${port}`);
        });
    } catch (error) {    
        console.log(error); 
    }
}
start(); 