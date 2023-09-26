const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


const blog = require('./data/blog.json');

// middle ware 
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.PIXEL_EDITOR_USER}:${process.env.PIXEL_EDITOR_PASS}@cluster0.08jlhdc.mongodb.net/?retryWrites=true&w=majority`;

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
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Pixel editor starts editing')
})

// blog 
app.get('/blog', (req, res)=>{
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
})