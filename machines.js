const express = require("express");
const cors = require("cors");
require ("dotenv").config();
const { MongoClient} = require('mongodb')
const{ObjectId}= require('mongodb');

const router = express();
router.use(cors());

const dbURL = process.env.DB_URL || 'mongodb://127.0.0.1:27017'
router.use(express.json());


//adding new machines to clusters
router.put("/:clusterName",async(req,res)=>{
    try {
        let client = await MongoClient.connect(dbURL);
        let db = await client.db('cloud');
       
        let data = await db.collection("clusters").findOne({"machines.name":req.body.machines.name});
        if (!data) {
                await  db.collection('clusters').updateOne({ clusterName:req.params.clusterName},{$push:{machines :req.body.machines }}) 
                res.status('200').json({ message: "machine added to cluster" });
            }else{
                res.status("208").json({message:"machine already added to one of the cluster"});
            }
          
        
        client.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
})


//deleting machines from cluster

router.delete('/delete/:clusterName/:machinename', async (req, res) => {
    try {
        let client = await MongoClient.connect(dbURL);
        let db = await client.db('cloud');
        let data = await db.collection("clusters").findOne({clusterName:req.params.clusterName })
            if(data){
               
                await  db.collection('clusters').updateOne({ _id:ObjectId(data._id)},{$pull:{machines:{name :req.params.machinename} }}) 
                res.status(200).json({message:"machine deleted"})
            }
            else {
                res.status(404).json({ message: "Machine not found" })
            }  
            client.close();
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }

})

//updating tag on single machine
router.put("/tags/:clusterName/:machinename",async(req,res)=>{
    try {
        let client = await MongoClient.connect(dbURL);
        let db = client.db("cloud");
        let data = await db.collection("clusters").findOne({clusterName:req.params.clusterName })
   
        if (data) {
            
            await  db.collection('clusters').updateOne({ "machines.name":req.params.machinename},{$set:{"machines.$.tags": req.body.tags }}) 
            res.status('200').json({ message: "tag updated" });
        }else {
            res.status("401").json({ message: "DATA NOT AVAILABLE" })
        }
        client.close();
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})

//updating tags on multiple machines
router.put("/tags/:tags",async(req,res)=>{
    try {
        let client = await MongoClient.connect(dbURL);
        let db = client.db("cloud");   
        let data= await  db.collection('clusters').updateMany({ "machines.tags":req.params.tags},{$set:{"machines.$[].tags": req.body.tags }},false,true) 
            
           if(data){
            res.status('200').json({ message: "tags updated" });
           }else{
            res.status("401").json({ message: "DATA NOT AVAILABLE" })
           }
           
        
        
        client.close();
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})



//finding machines based on tags
// router.get("/tags/:tags",async(req,res)=>{
//     try {
        
//         let client = await MongoClient.connect(dbURL);
//         let db = client.db("cloud");   
//         let data= await  db.collection('clusters').find({machines:{$elemMatch:{tags:req.params.tags}}}).toArray();
            
//            if(data){
//             res.status('200').json({data });
//            }else{
//             res.status("404").json({ message: "DATA NOT AVAILABLE" })
//            }
           
//         client.close();

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({message:"Internal server error"})
//     }
// })
router.get("/tags/:tags",async(req,res)=>{
    try {

        
        let client = await MongoClient.connect(dbURL);
        let db = client.db("cloud");
        // let data = await db.collection("clusters").find({machines:{$elemMatch:{tags:req.params.tags}}}).toArray();
        let data = await db.collection("clusters").aggregate([
            {"$match":{
                "machines":{
                    "$elemMatch":{
                        "$and":[
                            {tags:req.params.tags}
                        ]
                    }
                }
            }},{
                "$project":{
                    "clusterName":1,"clusterRegion":1,
                    "machines":{
                        "$filter":{
                            "input":"$machines",
                            "as":"machines",
                            "cond":{
                                "$and":[
                                    {"eq":["$machines.tags",req.params.tags]}
                                ]
                            }
                        }
                    }
                }
            }
        ]).toArray();
        if (data.length >0) {
            res.status('200').json({data});
        }else {
            res.status("404").json({ message: "DATA NOT AVAILABLE" })
        }
        client.close();
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})

router.get('/machinecount',async(req,res)=>{
    try {
        let client = await MongoClient.connect(dbURL);
        let db = client.db("cloud");   
    
        let data= await  db.collection('clusters').find({machines:{$exists:true}}).toArray()
            
           if(data){
            res.status('200').json({ data});
           }else{
            res.status("404").json({ message: "count not found" })
           }
           
        
        
        client.close();
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})


//to get all the machines which are running

router.get('/start',async(req,res)=>{
    try {
        let client = await MongoClient.connect(dbURL);
        let db = client.db("cloud");   
    
        let data= await  db.collection('clusters').aggregate([
            {
               "$match" : {
                   "machines" : {
                      "$elemMatch" : {
                         "$and" : [
                            { "tags" : "start" }
                         ]
                      }
                   },
               }
            },
            {
               "$project" : {
                   "clusterName" : 1, "clusterRegion" : 1,
                   "machines" : {
                      "$filter" : {
                         "input" : "$machines",
                         "as" : "machines",
                         "cond" : {
                            "$and" : [
                               { "$eq" : [ "$$machines.tags", "start" ] }
                            ]
                         }
                      }
                   }
               }
            }
            ]).toArray()
           if(data){
            res.status('200').json({ data});
           }else{
            res.status("404").json({ message: "count not found" })
           }
           
        
        
        client.close();
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})


//to get all the machines which are rebooting
router.get('/reboot',async(req,res)=>{
    try {
        let client = await MongoClient.connect(dbURL);
        let db = client.db("cloud");   
    
        let data= await  db.collection('clusters').aggregate([
            {
               "$match" : {
                   "machines" : {
                      "$elemMatch" : {
                         "$and" : [
                            { "tags" : "reboot" }
                         ]
                      }
                   },
               }
            },
            {
               "$project" : {
                   "clusterName" : 1, "clusterRegion" : 1,
                   "machines" : {
                      "$filter" : {
                         "input" : "$machines",
                         "as" : "machines",
                         "cond" : {
                            "$and" : [
                               { "$eq" : [ "$$machines.tags", "reboot" ] }
                            ]
                         }
                      }
                   }
               }
            }
            ]).toArray()
           if(data){
            res.status('200').json({ data});
           }else{
            res.status("404").json({ message: "count not found" })
           }
           
        
        
        client.close();
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})


//to get all the machines which is inactive.
router.get('/stop',async(req,res)=>{
    try {
        let client = await MongoClient.connect(dbURL);
        let db = client.db("cloud");   
    
        let data= await  db.collection('clusters').aggregate([
            {
               "$match" : {
                   "machines" : {
                      "$elemMatch" : {
                         "$and" : [
                            { "tags" : "stop" }
                         ]
                      }
                   },
               }
            },
            {
               "$project" : {
                   "clusterName" : 1, "clusterRegion" : 1,
                   "machines" : {
                      "$filter" : {
                         "input" : "$machines",
                         "as" : "machines",
                         "cond" : {
                            "$and" : [
                               { "$eq" : [ "$$machines.tags", "stop" ] }
                            ]
                         }
                      }
                   }
               }
            }
            ]).toArray()
           if(data){
            res.status('200').json({ data});
           }else{
            res.status("404").json({ message: "count not found" })
           }
           
        
        
        client.close();
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})

module.exports = router;