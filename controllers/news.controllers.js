const {
  fetchTopics,
  fetchArticlesById,
  upvoteArticle,
  fetchUsers,
  fetchCommentsForArticle,
  fetchArticles,
  writeComment,
  removeComment,
  fetchAPIjson,
} = require("../models/news.models");
const endpointsJson = require("../endpoints.json");
exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticlesById = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticlesById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticleId = (req, res, next) => {
  upvoteArticle(req)
    .then((returnedQuery) => {
      const returnedArticle = returnedQuery;
      res.status(200).send({ returnedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getCommentsForArticle = (req, res, next) => {
  const requiredId = req.params.article_id;
  fetchCommentsForArticle(requiredId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  const topic = req.query.topic;
  fetchArticles(sort_by, order, topic).then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.postComment = (req, res, next) => {
  writeComment(req)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  removeComment(req.params.comment_id)
    .then((comment) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAPIjson = (req, res, next) => {
  res.status(200).send(endpointsJson);
};
