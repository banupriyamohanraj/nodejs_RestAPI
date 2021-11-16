const express = require("express");
const cors = require("cors");
require ("dotenv").config();

const { MongoClient} = require('mongodb')
const{ObjectId}= require('mongodb');
const machines = require('./machines')
const userAuth = require('./userAuth')
const authorize = require('./authorize')

const app = express();

const port = process.env.PORT || 9000
const dbURL = process.env.DB_URL || 'mongodb://127.0.0.1:27017'

app.use(express.json());
app.use(cors(({
    origin: 'https://cloudapp-mern.netlify.app'
})));
app.use("/machines",machines)
app.use("/auth",userAuth)




//ROUTES
//get all the clusters
app.get("/",authorize, async (req, res) => {
    try {
        let client = await MongoClient.connect(dbURL);
        let db = await client.db('cloud');
        let data = await db.collection("clusters").find().toArray();
        if (data) {
            
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


//get single cluster info
app.get("/:clusterName",async(req,res)=>{
    try {
        let client = await MongoClient.connect(dbURL);
        let db = await client.db('cloud');
        let data = await db.collection("clusters").findOne({clusterName:req.params.clusterName })
        if (data) {
            
            res.status(200).json(data)
        } else {
            res.status(404).json({ message: "no data found" })
        }
        client.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
})


//create a new cluster
app.post('/add',async(req,res)=>{
    try {
        let client = await MongoClient.connect(dbURL);
        let db = await client.db('cloud');
        let data = await db.collection("clusters").findOne({clusterName:req.body.clusterName })
        if (!data) {
            await db.collection("clusters").insertOne({clusterName:req.body.clusterName,clusterRegion:req.body.clusterRegion,machines:req.body.machines});
            res.status('201').json({ message: "cluster created" });
        } else {
            res.status("401").json({ message: "cluster already exists" })
        }
        client.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }

})


//delete a cluster
app.delete('/delete/:clusterName', async (req, res) => {
    try {
        let client = await MongoClient.connect(dbURL);
        let db = await client.db('cloud');

        let data = await db.collection("clusters").findOneAndDelete({ clusterName :req.params.clusterName })
            if(data){
                res.status(200).json({message:"cluster deleted"})
            }
            else {
                res.status(404).json({ message: "cluster not found" })
            }  
            client.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }

})


//Start Listening to server
app.listen(port,()=>{console.log(`app runs with ${port}`)})