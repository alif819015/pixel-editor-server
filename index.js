const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();

const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);
const path = require('path');


const port = process.env.PORT || 5000;


// middle ware 
app.use(cors())
app.use(express.json())

app.use(express.static("../pixel-editor/dist"))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../pixel-editor', 'dist', 'index.html'))
})

io.on('connection', function (socket) {
    console.log('new user connected');

    socket.on('chat', (msg) => {
        io.emit('chatShow', msg)
    })
})

io.on("connection", (socket) => {
    console.log("User connected:");

    socket.on("imageUpdate", (updatedState) => {
        io.emit("imageUpdate", updatedState);
    });

    // Update the selectedImageUpdate event handler
    socket.on("selectedImageUpdate", (imageUrl) => {
        socket.broadcast.emit("collSelectedImageUpdate", imageUrl);
    });


    socket.on("disconnect", () => {
        console.log("User disconnected:");
    });
});


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

app.listen(port, () => {
    console.log(`Pixel editor starts editing on port ${port}`);
})