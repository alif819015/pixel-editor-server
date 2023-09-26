const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

const blog = require('./data/blog.json');


const uri = `mongodb+srv://${process.env.PIXEL_EDITOR_USER}:${process.env.PIXEL_EDITOR_PASS}@cluster0.08jlhdc.mongodb.net/?retryWrites=true&w=majority`;

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
        const usersCollection = client.db("pixelEditor").collection("users");
        const feedbackCollection = client.db("pixelEditor").collection("feedback");

        //users related api's.......................
        // .......................................
        app.post("/users", async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const existingUser = await usersCollection.findOne(query);

            if (existingUser) {
                return res.send({ message: "user already exists" });
            }

            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        //get all users
        app.get("/users", async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        });

        //delete user
        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        });

        //make ADMIN
        app.patch("/users/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    role: req.body.role,
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.send(result);
        });



        //feedback api
        //add feedback
        app.post("/feedback", async (req, res) => {
            const item = req.body;
            const result = await feedbackCollection.insertOne(item);
            res.send(result);
        });

        //get all feedback
        app.get("/feedback", async (req, res) => {
            const result = await feedbackCollection.find().toArray();
            res.send(result);
        });

        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Pixel editor starts editing");
});

// blog 
app.get('/blog', (req, res) => {
    res.send(blog);
})

app.get('/blog/:id', (req, res) => {
    const id = req.params.id;
    // console.log(id)
    const selectBlog = blog.find(c => c.id === id);
    res.send(selectBlog);
})

app.listen(port, () => {
    console.log(`Pixel editor starts editing on port ${port}`);
});
