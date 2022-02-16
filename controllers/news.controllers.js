const {fetchTopics, fetchArticlesById, upvoteArticle} = require('../models/news.models')

exports.getTopics = (req, res) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics})
    })
}


exports.getArticlesById = (req, res, next) => {
    const articleId = req.params.article_id
    fetchArticlesById(articleId)
        .then((article) => {
            res.status(200).send({article})
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



