const db = require('../db/connection');

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics").then((result) => {
        return result.rows;
    })

}


exports.fetchArticlesById = (requested_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [requested_id]).then(({rows})=> {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "Article not found"})}

        else {
            return rows[0]
        }
        
    })
}

exports.upvoteArticle = (req) => {
    const votes = req.body.inc_votes;
    const articleId = req.params.article_id;
    return db.query('UPDATE articles SET   votes = votes + $1 WHERE article_id = $2  RETURNING *;', [votes, articleId]).then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "Article not found"})}

        else {
            return rows[0]
        }
    })
}


exports.fetchUsers = () => {
    return db.query("SELECT username FROM users;")
        .then((result) => {
            return result.rows;
        })
    
}

exports.fetchCommentsForArticle = (articleId) => {
    return db.query("SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1;", [articleId])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: `Comments for article ${articleId} not found`})}
    
            else {
                return rows;
            }
        })
}