const express = require('express');
const {getTopics, getArticlesById, updateArticleId} = require("./controllers/news.controllers")
const {error500, customerrors,psqlerrors} = require('./errors');

const app = express();
app.use(express.json())

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById)
app.patch("/api/articles/:article_id", updateArticleId)


app.use(customerrors)
app.use(psqlerrors)
app.use(error500)
app.all('/*', (req, res) => {
    res.status(404).send({msg: "Path not found"})
});

module.exports = app