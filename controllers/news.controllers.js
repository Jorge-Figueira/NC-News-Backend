const {fetchTopics, fetchArticlesById, checkArticleIdExists} = require('../models/news.models')

exports.getTopics = (req, res) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics})
    })
}


exports.getArticlesById = (req, res, next) => {
    const articleId = req.params.article_id
    fetchArticlesById(articleId)
        .then(([article]) => {
            res.status(200).send({article})
        })
        .catch((err) => {
            next(err)
            // return res.status(404).send(err)})
        })

   
    
}


