const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxobuiv.mongodb.net/?retryWrites=true&w=majority`;

// middlewere
app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const bistroDb = client.db('bistroDb');
    const menuCollection = bistroDb.collection("menu");
    const reviewsCollection = bistroDb.collection("reviews");
    const cartCollection = bistroDb.collection("carts");

    app.get('/menu', async(req, res) =>{
        const result = await menuCollection.find().toArray();
        res.send(result);
    });

    app.get('/reviews', async(req, res) =>{
        const result = await reviewsCollection.find().toArray();
        res.send(result);
    });

    //? cart collection
    app.post('/carts', async(req, res) => {
      const item = req.body;
      console.log(item);
      const result = await cartCollection.insertOne(item);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Boss is sitting')
});

app.listen(port, ()=>{
    console.log(`Bistro Boss is sitting on port ${port}`);
});

/**
 * ------------------------------
 *        Naming Convention
 * ------------------------------
 * users : userCollection
 * app.get('/users')
 * app.get('/users/:id')
 * app.post('/users')
 * app.patch('users/:id')
 * app.put('/users/:id')
 * app.delete('/users/:id')
 * */ 