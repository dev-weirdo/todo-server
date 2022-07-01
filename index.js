//import libraries
const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middlewares
// app.use(cors());
app.use(cors({
    origin: "*"
}));
app.use(express.json());

//db connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tndro.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        const taskCollection = client.db('todo').collection('tasks');
        const completedTaskCollection = client.db('todo').collection('cTasks');

        //API's
        app.get('/tasks', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        })
        app.get('/completedTasks', async (req, res) => {
            const query = {};
            const cursor = completedTaskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        })
        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const task = await taskCollection.findOne(query);
            res.send(task);
        })
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const task = await taskCollection.deleteOne(query);
            res.send(task);
        })
        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: body,
            };
            const task = await taskCollection.updateOne(query, updateDoc, options);
            res.send(task);
        })
        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        })
        app.post('/completedTasks', async (req, res) => {
            const task = req.body;
            const result = await completedTaskCollection.insertOne(task);
            res.send(result);
        })
    }

    finally { }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log('App running')
})