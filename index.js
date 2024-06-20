const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

app.use(bodyParser.json());

const dataFilePath = path.join(__dirname, 'data.json');

// Utility functions to read and write data
const readData = () => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Routes for CRUD operations
app.get('/items', (req, res) => {
    const items = readData();
    res.json(items);
});

app.get('/items/:id', (req, res) => {
    const items = readData();
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (item) {
        res.json(item);
    } else {
        res.status(404).send('Not found');
    }
});

app.post('/items', (req, res) => {
    const items = readData();
    const newItem = {
        userId:req.body.userId,
        id: items.length + 1,
        title: req.body.title,
        completed: req.body.completed
    };
    // console.log(newItem);
    items.push(newItem);
    writeData(items);
    res.status(201).json(newItem);
});

app.put('/items/:id', (req, res) => {
    const items = readData();
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (item) {
        item.userId=req.body.userId;
        item.title = req.body.title;
        item.completed = req.body.completed;
        writeData(items);
        res.json(item);
    } else {
        res.status(404).send('Not found');
    }
});

app.delete('/items/:id', (req, res) => {
    const items = readData();
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
    if (itemIndex !== -1) {
        items.splice(itemIndex, 1);
        writeData(items);
        res.status(204).send();
    } else {
        res.status(404).send('Not found');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
