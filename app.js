const cors = require('cors')
const express = require('express');
const {getTopics, getArticlesById, updateArticleId, getUsers, getCommentsForArticle, getArticles, postComment, deleteComment, getAPIjson} = require("./controllers/news.controllers")
const {error500, customerrors,psqlerrors} = require('./errors');

const app = express();
app.use(cors())
app.use(express.json())

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById)
app.patch("/api/articles/:article_id", updateArticleId)
app.get('/api/users', getUsers)
app.get('/api/articles/:article_id/comments', getCommentsForArticle)
app.get('/api/articles', getArticles)
app.post('/api/articles/:article_id/comments', postComment)
app.delete("/api/comments/:comment_id", deleteComment)
app.get("/api/", getAPIjson)


app.use(customerrors)
app.use(psqlerrors)
app.use(error500)
app.all('/*', (req, res) => {
    res.status(404).send({msg: "Path not found"})
});

module.exports = app