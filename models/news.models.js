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
            return rows
        }
        
    })
}

exports.checkArticleIdExists = (requested_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [requested_id]).then(({rows})=>{
        if (rows.length === 0) {return Promise.reject({status: 404, msg: "Article not found"})}
    });
}