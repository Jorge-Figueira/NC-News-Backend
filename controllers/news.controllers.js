const {fetchTopics, fetchArticlesById, upvoteArticle, fetchUsers, fetchCommentsForArticle} = require('../models/news.models')

exports.getTopics = (req, res) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics})
    })
}


exports.getArticlesById = (req, res, next) => {
    const articleId = req.params.article_id
    Promise.all([fetchArticlesById(articleId),fetchCommentsForArticle(articleId)])
        .then((mistery) => {
            const retrunObject = {article: mistery[0],comment_count: mistery[1].length}
            
            res.status(200).send(retrunObject)
        })
        .catch((err) => {
            next(err)
        })
    
    
}

exports.updateArticleId = (req, res, next) => {
    upvoteArticle(req)
        .then((returnedQuery) => {
            const returnedArticle = returnedQuery
            res.status(200).send({returnedArticle})
        })
        .catch((err) => {
            next(err)
        })
}


exports.getUsers = (req, res, next) => {
    fetchUsers()
        .then((users) => {
            res.status(200).send({users})
        })
}


exports.getCommentsForArticle = (req, res, next) => {
    const requiredId = req.params.article_id
    fetchCommentsForArticle(requiredId)
        .then((comments) => {
            res.status(200).send({comments})
        })
        .catch((err) => {
            next(err)
        })
}


