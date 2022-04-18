<h1 align= "center"> Northcoders News API</h1>

Welcome to the backend API of my NC-NEWS project I have developed as part of the Northcoders BootCamp.

## Description:

This API has been developed at the end of the Backend Phase of the bootcamp as an individual project. You can access the API [here] (https://pretend-you-reddit.herokuapp.com/api/). On the previus link you get a description of the endpoints of the API. The endpoints are:

- GET /api:

  - Responds with a JSON with instructions about every endopoint on the API.
  - I does not accept queries.

- GET /api/articles/:article_id:

  - The response is a JSON with an object on the key article.
  - I does not accept queries.
  - Example of response:
    ```
    {
      "topics": [
        {"slug":"football","description":"FOOTIE!"}
      ]
    }
    ```

- GET /api/articles/:article_id:

  - The response is a JSON with an object on the key article.
  - Does not accept queries.
  - Example of response:
    ```
    {"article":{
      "article_id":3,
      "title":"22 Amazing open source React projects",
      "topic":"coding",
      "author":"happyamy2016",
      "body":"This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.",
      "created_at":"2020-02-29T11:12:00.000Z",
      "votes":0,
      "comment_count":"10"}}
    ```

- PATCH /api/articles/:article_id:

  - Takes an object as request with a key inc_votes - `{ inc_votes: newVote }` -, the response is a JSON containing the article with the number of votes updated.
  - Does not accept queries.
    Example of response:
    ```
    {
      "article":{
        "article_id":1,
        "title":"Running a Node App",
        "topic":"coding",
        "author":"jessjelly",
        "body":"This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        "created_at":"2020-11-07T06:03:00.000Z",
        "votes":1 ,
        "comment_count":"8"
        }
    }
    ```

- GET /api/users:

  - Responds with a JSON that contains an array on the key users. Each item in the array is an object with a single key 'username'.
  - Does not accept queries.
  - Example of response:
    ```
    {"users":[
        {"username":"tickle122"},
        {"username":"grumpy19"},
        {"username":"happyamy2016"},
        {"username":"cooljmessy"},
        {"username":"weegembump"},
        {"username":"jessjelly"}
        ]
    }
    ```

- GET /api/articles:

  - Responds with a JSON that contains an array on the key articles. It accepts queries to sort by an especific column in ascending or descending order. It also accepts queries filtered by topic.
  - Accepts the following queries: `["sort_by", "order", "topic"]`.
  - Example of response:

    ```
    {"article":[
        {
          "article_id":1,
          "title":"Running a Node App",
          "topic":"coding",
          "author":"jessjelly",
          "body":"This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
          "created_at":"2020-11-07T06:03:00.000Z",
          "votes":0,
          "comment_count":"8"
        }
        ]
    }

    ```

- GET /api/articles/:article_id/comments:

  - The response is a JSON containing an array of comments for the specific article.
  - Does not accept queries.
  - Example of response:
    ```
    {"comments": {
        "comments":[
          {"comment_id":31,
            "votes":11,
            "created_at":"2020-09-26T17:16:00.000Z",
            "author":"weegembump",
            "body":"Sit sequi odio suscipit. Iure quisquam qui alias distinctio eos officia enim aut sit. Corrupti ut praesentium ut iste earum itaque qui. Dolores in ab rerum consequuntur. Id ab aliquid autem dolore."
          },
          {
            "comment_id":33,
            "votes":4,
            "created_at":"2019-12-31T21:21:00.000Z",
            "author":"cooljmessy",
            "body":"Explicabo perspiciatis voluptatem sunt tenetur maxime aut. Optio totam modi. Perspiciatis et quia."
          }
          ]
        }
    }
    ```

- POST /api/articles/:article_id/comments:

  - Takes an object as request containing the keys username and body - `{username:'lurker', body:'Let's see if it works'}` - and returns a JSON containing the posted comment
  - Does not accept queries.
  - Example of response:
    ```
    {
    "comment_id": 19,
    "body": "Let's see if it works",
    "article_id": 1,
    "author": "lurker",
    "votes": 0,
    "created_at": "2022-03-06T19:58:42.477Z"
    }
    ```

- DELETE /api/comments/:comment_id:
  - Deletes the comment with the given comment_id. Does not return a response body.

## How to use the source code?

You can clone this repository on your computer and use it locally. After you clone it, you need to create two .env files inside the main directory of the project: .env.development and .env.test.  
Inside .env.development you should type `PGDATABASE=nc_news` and inside .env.test `PGDATABASE=nc_news_test`.

You can install all the required packages running `npm install` on your terminal.

To create the database, we run the command `npm run setup.dbs`. After the database is created, we should seed it. To do so, we run the command `npm run seed`.

I hope you enjoy the using this code. I am still learning so any feedback is appreciated.
