const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
//username: simpleDBUser
//password: AOO520LE3LDf2TXW

const uri =
  "mongodb+srv://simpleDBUser:AOO520LE3LDf2TXW@cluster0.cw3ccv0.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    //CRUD operation

    const database = client.db("usersdb");
    const userCollection = database.collection("users");

    //R --> Read data from the db
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //to find a specific data
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    //C --> Create data in the database
    app.post("/users", async (req, res) => {
      console.log("data in the server", req.body);
      const newData = req.body;
      const result = await userCollection.insertOne(newData);
      res.send(result);
    });

    //delete data from the db
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("simple crud server is running");
});

app.listen(port, () => {
  console.log(`simple crud server running on port: ${port}`);
});
