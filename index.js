const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port =  process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fbkqb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        // console.log('connected to database')
        const database = client.db('travelAgency');
        const serviceCollection = database.collection('services');
        const ordersCollection = database.collection('orders');

        //get products API
        app.get('/services', async(req, res) => {
            const cursor = serviceCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
          // get api for a single service

    app.get("/placeorder/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await  serviceCollection.findOne(query);
        res.send(result);

      });
  

      //UPDATE API  
      app.put("/orders/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            status: "Approved"
          },
        };
        const result = await ordersCollection.updateOne(filter, updateDoc, options)
        res.json(result);
      });

    //DELETE API
    app.delete('/orders/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await ordersCollection.deleteOne(query);
        console.log('deleting user with id', result);
        res.json(result)
    })

        //get manage  API
        app.get('/orders', async(req, res) => {
            const cursor = ordersCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

 // post api for insert booking of an user

 app.post("/placeorder", async (req, res) => {
    const orderInfo = req.body;
    const result = await ordersCollection.insertOne(orderInfo);
    res.json(result);
  });

// post api for add a new event

app.post("/addevent", async (req, res) => {
    const servicesInfo = req.body;
    const result = await serviceCollection.insertOne(servicesInfo);
    res.json(result);
  });

    }

    finally{
        // await client.close();
    }
}

run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`running travel server`, port)
})