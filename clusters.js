const express = require("express");
const cors = require("cors");
require ("dotenv").config();
const { MongoClient} = require('mongodb')
const{ObjectId}= require('mongodb');

const router = express();
router.use(cors());

const dbURL = process.env.DB_URL || 'mongodb://127.0.0.1:27017'
router.use(express.json());



//get all the clusters
router.get("/", async (req, res) => {
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
router.get("/:clusterName",async(req,res)=>{
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
router.post('/add',async(req,res)=>{
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
router.delete('/delete/:clusterName', async (req, res) => {
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


module.exports = router;