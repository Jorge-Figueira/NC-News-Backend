const express = require('express');
const {getTopics} = require("./controllers/news.controllers")

const app = express();

app.get("/api/topics", getTopics);

app.all('/*', (req, res) => {
    res.status(404).send({msg: "Path not found"})
});

module.exports = app