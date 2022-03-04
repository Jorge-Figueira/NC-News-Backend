const db = require('../db/connection');

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics").then((result) => {
        return result.rows;
    })

}


exports.fetchArticlesById = (requested_id) => {
    return db.query("SELECT * FROM comments WHERE article_id = $1;", [requested_id])
        .then(({rows}) => {
            if (rows.length === 0) {
                return db.query("SELECT * FROM articles WHERE article_id = $1;", [requested_id])
                    .then(({rows}) => {
                       if (rows.length === 0) {
                             return Promise.reject({status: 404, msg: "Article not found"})
                        } else {
                            rows[0].comment_count = 0;
                            return rows[0]
                        }
                    })                            
            } else {
                return db.query("SELECT articles.*, COUNT(*) AS comment_count FROM articles  JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;", [requested_id]).then(({rows})=> {
                    return rows[0]
                })
                   
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
            return rows;
            
        })
}

exports.fetchArticles = (sort_by="created_at", order="desc", topic) => {
    
   
    
    const columnsAvailable = ["article_id", "title", "topic", "author", "body", "created_at", "votes"];
    if (!columnsAvailable.includes(sort_by)){
        return Promise.reject({status:404, msg:"Column not found"})
    }
    const ordersAvailable = ["asc", "desc"]
    if (!ordersAvailable.includes(order)) {
        return Promise.reject({status:404, msg: "Order by not unavailable"})
    }
    const itemsToQuery = [];
    let queryString = `SELECT articles.* , COUNT(comments.comment_id) AS comment_count FROM articles   LEFT JOIN comments ON articles.article_id = comments.article_id `;
    if (topic) {
        itemsToQuery.push(topic);
        queryString += "WHERE articles.topic = $1 ";
        itemsToQuery.push(topic);
    }

    queryString += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order.toUpperCase()};`;


    
    if(itemsToQuery.length >0) {
        return db.query(queryString, [topic]).then(({rows}) => {
            return rows
        });
    } else {
        return db.query(queryString) 
            .then(({rows}) => {            
                return rows
            })
    }        
};


exports.writeComment = ({body, params}) => {
    return db.query(
        "INSERT INTO comments  (body, author, article_id, votes, created_at) VALUES ($1, $2, $3, 0, CURRENT_TIMESTAMP) RETURNING *;",[body.body, body.username, params.article_id ])
        .then(({rows}) => {
            return rows[0];
        })
        .catch((error) => {
            if (error.code === "23503") {
                const columns =["body", "author", "article_id", "votes", "created_at"];
                const columnWithError = columns.map((column) => {
                    if (error.detail.includes(column)) {
                        return column
                    }
                }).filter((column) => column !== undefined)

                return Promise.reject({status: 404, msg: `${columnWithError[0]} not found`})
            } else {
                return Promise.reject(error)
            }
        })

}


exports.removeComment = (comment_id) => {

    return db.query("SELECT *  FROM comments WHERE comment_id = $1;", [comment_id])
        .then(({rows}) => {
            if (rows.length === 0 ) {
                return Promise.reject({status: 404, msg: "Comment not found"})
                            
            }
        })
        .then(() => {
            return db.query("DELETE  FROM comments WHERE comment_id = $1 RETURNING *;", [comment_id])
                .then(({rows}) => {
                    return rows[0]
                })
    
        })

}

exports.fetchAPIjson = () => {
    return {
        "GET /api": {
          "description": "serves up a json representation of all the available endpoints of the api"
        },
        "GET /api/topics": {
          "description": "serves an array of all topics",
          "queries": [],
          "exampleResponse": {
            "topics": [{ "slug": "football", "description": "Footie!" }]
          }
        },
        "GET /api/articles": {
          "description": "serves an array of all topics",
          "queries": ["author", "topic", "sort_by", "order"],
          "exampleResponse": {
            "articles": [
              {
                "title": "Seafood substitutions are increasing",
                "topic": "cooking",
                "author": "weegembump",
                "body": "Text from the article..",
                "created_at": 1527695953341
              }
            ]
          }
        }
      }
}