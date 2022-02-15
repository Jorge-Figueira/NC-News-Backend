const express = require('express');
const {getTopics, getArticlesById} = require("./controllers/news.controllers")
const {error500, customerrors,psqlerrors} = require('./errors');

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById)

app.use(customerrors)
app.use(psqlerrors)
app.use(error500)
app.all('/*', (req, res) => {
    res.status(404).send({msg: "Path not found"})
});

module.exports = app