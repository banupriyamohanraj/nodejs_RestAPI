const express = require("express");
const cors = require("cors");
require ("dotenv").config();

const { MongoClient} = require('mongodb')
const{ObjectId}= require('mongodb');
const machines = require('./machines')
const userAuth = require('./userAuth')
const authorize = require('./authorize')
const Clusters = require("./clusters")
const app = express();

const port = process.env.PORT || 9000
const dbURL = process.env.DB_URL || 'mongodb://127.0.0.1:27017'

app.use(express.json());
app.use(cors());
app.use("/machines",machines)
app.use("/auth",userAuth)
app.use("/cluster",Clusters)



//ROUTES
//get all the login info 
app.get("/",authorize, async (req, res) => {
    try {
        let client = await MongoClient.connect(dbURL);
        let db = await client.db('user');
        let data = await db.collection("logininfo").find().toArray();
        if (data) {
            console.log(data)
            res.status(200).json(data)
        } else {
            res.status(404).json({ message: "no data found" })
        }
        client.close();
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
})




//Start Listening to server
app.listen(port,()=>{console.log(`app runs with ${port}`)})