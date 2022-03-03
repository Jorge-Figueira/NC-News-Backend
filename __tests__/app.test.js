const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");


afterAll(()=> db.end())
beforeEach(() => seed(testData));



describe('All wrong paths return a status 404 and a message  "Path not found"', () => {
    test('/api/topis', () => {
        return request(app).get("/api/topis")
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("Path not found")
        });
    });

    test('/api/tipics', () => {
        return request(app)
            .get("/api/tipics")
            .expect(404)
            .then(({body})=> {
                expect(body.msg).toBe("Path not found")
        })
    })
});

describe("/api/topics", () => {
    describe("GET", () => {
        test('Status 200, responds with an array', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({body:topics}) => {
                    expect(topics.topics.constructor).toBe(Array)
            })
        })
        test('Status 200, the objects on the response contain the keys "slug" "description"', () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then((({body: response}) => {
                    response.topics.forEach((topic) => {
                        expect(topic).toEqual(
                            expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String),
                        
                        }));
                    });
                

            }));
            
        });
    });
});


describe('/api/articles/:article_id', () => {
    describe('GET', () => {
        test('Status 200, the returned object has the correct keys and datatypes', () => {
            return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(({body: {article}}) => {
                    expect(article).toEqual({
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'I find this existence challenging',
                        created_at: '2020-07-09T20:11:00.000Z',
                        votes: 100,
                        comment_count: '11'
                      }             
                    )
                })
        });

        test('Status 200, the returned object has comment_count value 0 if there are no comments for a valid article', () => {
            return request(app)
                .get("/api/articles/2")
                .expect(200)
                .then(({body:{article}}) => {
                    expect(article).toEqual({
                        article_id: 2,
                        title: 'Sony Vaio; or, The Laptop',
                        topic: 'mitch',
                        author: 'icellusedkars',
                        body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
                        created_at: '2020-10-16T05:03:00.000Z',
                        votes: 0,
                        comment_count: 0
                        }  
                    )
                    
                })
        })
        
        test('Status 404 for valid requests not found', () => {
            return request(app)
                .get("/api/articles/90000")
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe('Article not found')
            })
            
        })

        test('Status 400 for invalid requests', () => {
            return request(app)
                .get('/api/articles/string')
                .expect(400)
                .then(({body}) => {                
                    expect(body.msg).toBe('Bad request')
            })
        })

        
    })


    describe('PATCH', () => {
        const article1 = {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 100
        }
        test('status 200, if the id is valid and exist in the database, the API responds with the updated article', () => {
             
              
            return request(app)
                .patch("/api/articles/1")
                .send({inc_votes: 4})
                .expect(200)
                .then(({body:{returnedArticle}}) => {
                    expect(returnedArticle).toEqual(
                        expect.objectContaining({
                        article_id: article1.article_id,
                        title: article1.title,
                        topic: article1.topic,
                        author: article1.author,
                        body: article1.body,
                        created_at: article1.created_at,
                        votes: article1.votes +4
                        })
                    )
            })
                
        
        });

        test('status 200, should work correctly for negative votes', () => {
            return request(app)
                .patch("/api/articles/1")
                .send({inc_votes: -10})
                .expect(200)
                .then(({body: {returnedArticle}}) => {
                    expect(returnedArticle).toEqual(
                        expect.objectContaining({
                            article_id: article1.article_id,
                            title: article1.title,
                            topic: article1.topic,
                            author: article1.author,
                            body: article1.body,
                            created_at: article1.created_at,
                            votes: article1.votes -10
                            })
                    )
                })
        })

        test('status 404, article not found', () => {
            return request(app)
                .patch("/api/articles/90000")
                .send({inc_votes: 1})
                .expect(404)
                .then(({body}) => {
                    expect(body.msg)
                    .toBe("Article not found")
                })
        })

        test('Status 400, path provided is not valid', () => {
            return request(app)
                .patch("/api/articles/string")
                .send({inc_votes: 3})
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Bad request');
            })
        })

        test('Status 400, request provided has a valid object key', () => {
            return request(app)
                .patch("/api/articles/1")
                .send({not_inc_votes: 3})
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Bad request')
            })
        })

        test('Status 400, the value on the inc_votes key is a number', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({inc_votes: "string"})
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Bad request');
            })
        })
    })

})

describe('/api/users', () => {

    describe('GET', () => {
        
        test('Status 200, the returned object has the correct keys and datatypes', () => {
            return request(app)
                .get("/api/users")
                .expect(200).then(({body:{users}}) => {
                    users.forEach((user) => {
                        expect(user).toEqual(
                            expect.objectContaining({
                                username: expect.any(String)
                            })
                        )
                    })
                })
                

        });

        test("Status 200, returns the correct data", () => {
            return request(app)
                .get("/api/users")
                .expect(200)
                .then(({body: {users}}) => {
                    expect(users).toEqual([
                        { username: 'butter_bridge' },
                        { username: 'icellusedkars' },
                        { username: 'rogersop' },
                        { username: 'lurker' }
                      ])
                })
        })
    })
})


describe('/api/articles/:article_id/comments', () => {

    describe('GET', () => {
        
        test('status 200, returns an object with the correct keys', () => {
            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({body: {comments}}) => {
                    expect(comments).toHaveLength(11);
                    comments.forEach((comment) => {
                        expect(comment).toEqual(
                            expect.objectContaining({
                                comment_id: expect.any(Number),
                                votes: expect.any(Number),
                                created_at: expect.any(String),
                                author: expect.any(String),                                body: expect.any(String)
                            })
                        )
                    })
                })
                
        });

        test("Status 200, returns the correct data", () => {
            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({body: {comments}}) => {
                    const expectedData = [
                        {
                          comment_id: 2,
                          votes: 14,
                          created_at: '2020-10-31T03:03:00.000Z',
                          author: 'butter_bridge',
                          body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.'
                        },
                        {
                          comment_id: 3,
                          votes: 100,
                          created_at: '2020-03-01T01:13:00.000Z',
                          author: 'icellusedkars',
                          body: 'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.'
                        },
                        {
                          comment_id: 4,
                          votes: -100,
                          created_at: '2020-02-23T12:01:00.000Z',
                          author: 'icellusedkars',
                          body: ' I carry a log — yes. Is it funny to you? It is not to me.'
                        },
                        {
                          comment_id: 5,
                          votes: 0,
                          created_at: '2020-11-03T21:00:00.000Z',
                          author: 'icellusedkars',
                          body: 'I hate streaming noses'
                        },
                        {
                          comment_id: 6,
                          votes: 0,
                          created_at: '2020-04-11T21:02:00.000Z',
                          author: 'icellusedkars',
                          body: 'I hate streaming eyes even more'
                        },
                        {
                          comment_id: 7,
                          votes: 0,
                          created_at: '2020-05-15T20:19:00.000Z',
                          author: 'icellusedkars',
                          body: 'Lobster pot'
                        },
                        {
                          comment_id: 8,
                          votes: 0,
                          created_at: '2020-04-14T20:19:00.000Z',
                          author: 'icellusedkars',
                          body: 'Delicious crackerbreads'
                        },
                        {
                          comment_id: 9,
                          votes: 0,
                          created_at: '2020-01-01T03:08:00.000Z',
                          author: 'icellusedkars',
                          body: 'Superficially charming'
                        },
                        {
                          comment_id: 12,
                          votes: 0,
                          created_at: '2020-03-02T07:10:00.000Z',
                          author: 'icellusedkars',
                          body: 'Massive intercranial brain haemorrhage'
                        },
                        {
                          comment_id: 13,
                          votes: 0,
                          created_at: '2020-06-15T10:25:00.000Z',
                          author: 'icellusedkars',
                          body: 'Fruit pastilles'
                        },
                        {
                          comment_id: 18,
                          votes: 16,
                          created_at: '2020-07-21T00:20:00.000Z',
                          author: 'butter_bridge',
                          body: 'This morning, I showered for nine minutes.'
                        }
                        ];
                    
                    expect(comments).toEqual(expectedData)

                    
                })

        })

        test("Status 404, returns an empty array if there are no comments for the required article", () => {
            return request(app)
                .get("/api/articles/9000000/comments")
                .expect(200)
                .then(({body}) => {
                    expect(body.comments).toEqual([])
                })
        })

        test("Status 404, triggers an error if the article_id is not valid", () => {
            return request(app)
                .get("/api/articles/string/comments")
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Bad request")
                })
        })
    })
})


describe('/api/articles', () => {
    describe('GET', () => {
        test('Status 200, returns an object with the correct keys and data', () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body: {articles}}) => {
                    articles.forEach((article) => {
                        expect(article).toEqual(
                            expect.objectContaining({
                                author: expect.any(String),
                                title: expect.any(String),
                                article_id: expect.any(Number),
                                topic: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                comment_count: expect.any(String)
                            })
                        )
                    })
                    
                })
        })  
        test('Status 200, the returned articles are ordered correctly', () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body: {articles}}) => {
                    const orderedIndexes =articles.map((article) => {
                        return article.article_id
                    })
                    
                    expect(orderedIndexes).toEqual([3, 6,  2, 12, 5, 1, 9, 10, 4, 8, 11, 7])
                })
        })
        test("Status 200, the articles have the correct comment_count", () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({body:{articles}}) => {
                    const comment_counts = articles.map((article) => {
                        return article.comment_count
                    })
                    expect(comment_counts).toEqual(['2', '1',  '0', '0', '2', '11', '2', '0', '0', '0',  '0', '0'])
                })
        })
        
        test("Status 200, the articles are sorted by author in default order column", () => {
            return request(app)
                .get("/api/articles?sort_by=author")
                .expect(200)
                .then(({body: {articles}}) => {
                    const authors = articles.map(({author}) => author)
                    expect(authors).toEqual([
                        'rogersop',      'rogersop',
                        'rogersop',      'icellusedkars',
                        'icellusedkars', 'icellusedkars',
                        'icellusedkars', 'icellusedkars',
                        'icellusedkars', 'butter_bridge',
                        'butter_bridge', 'butter_bridge'
                      ])
                })
                
        })
        test("Status 200, the articles are sorted by date if no query is sent", () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body: {articles}}) => {
                    const dates = articles.map(({created_at}) => created_at)
                    expect(dates).toEqual([
                        '2020-11-03T09:12:00.000Z',
                        '2020-10-18T01:00:00.000Z',
                        '2020-10-16T05:03:00.000Z',
                        '2020-10-11T11:24:00.000Z',
                        '2020-08-03T13:14:00.000Z',
                        '2020-07-09T20:11:00.000Z',
                        '2020-06-06T09:10:00.000Z',
                        '2020-05-14T04:15:00.000Z',
                        '2020-05-06T01:14:00.000Z',
                        '2020-04-17T01:08:00.000Z',
                        '2020-01-15T22:21:00.000Z',
                        '2020-01-07T14:08:00.000Z'
                      ])
                })
        })

        test("Status 200, the articles are sorted by date in ascending order if only an order query is passed", () => {
            return request(app)
                .get("/api/articles?order=asc")
                .expect(200)
                .then(({body:{articles}}) => {
                    const dates = articles.map(({created_at}) => created_at)
                    expect(dates).toEqual([
                        '2020-01-07T14:08:00.000Z',
                        '2020-01-15T22:21:00.000Z',
                        '2020-04-17T01:08:00.000Z',
                        '2020-05-06T01:14:00.000Z',
                        '2020-05-14T04:15:00.000Z',
                        '2020-06-06T09:10:00.000Z',
                        '2020-07-09T20:11:00.000Z',
                        '2020-08-03T13:14:00.000Z',
                        '2020-10-11T11:24:00.000Z',
                        '2020-10-16T05:03:00.000Z',
                        '2020-10-18T01:00:00.000Z',
                        '2020-11-03T09:12:00.000Z'
                      ])
                })
        })

        test("Status 200, querying by topic cats returns only articles with topic cats",() => {
            return request(app)
                .get("/api/articles?topic=cats")
                .expect(200)
                .then(({body: {articles}}) => {
                    expect(articles).toEqual([
                        {
                          article_id: 5,
                          title: 'UNCOVERED: catspiracy to bring down democracy',
                          topic: 'cats',
                          author: 'rogersop',
                          body: 'Bastet walks amongst us, and the cats are taking arms!',
                          created_at: '2020-08-03T13:14:00.000Z',
                          votes: 0,
                          comment_count: '2'
                        }
                      ])

                })
        })
    })
})



describe('/api/articles/:article_id/comment', () => {
    describe("POST", () => {
        test("status 200, returns an object with the posted commnet", () => {
            return request(app).post("/api/articles/1/comments")
                .expect(200)
                .send({username:"lurker", body:"Let's see if it works"})
                .then(({body:{comment}}) => {
                    expect(comment.author).toBe("lurker")
                })
        })

        test("Status 404, returns an error if the user is not on users table user not found", () => {
            return request(app).post("/api/articles/1/comments")
                .expect(404)
                .send({username: "Tecnobutrul", body: "Let's see if it works"})
                .then(({body: {msg}}) => {
                    expect(msg).toBe("author not found")
                })
                
        });

        test("Status 404, return an error if the article id does not exist", () => {
            return request(app).post("/api/articles/999999999/comments")
                .expect(404)
                .send({username:"lurker", body:"Let's see if it works"})
                .then(({body:{msg}}) => {
                    expect(msg).toBe("article_id not found")
                })
        })
    })
})


describe("/api/comments/:comment_id", () => {
    describe("DELETE", () => {
        test("Status 204, removes the comment for the given id correctly", () => {
            return request(app)
                .delete("/api/comments/1")
                .expect(204)
                

        })

        test("Status 404, returns an error if there isn't a  comment with the given id", () => {
            return request(app)
                .delete("/api/comments/00000")
                .expect(404)
                .then(({body:{msg}}) => {
                    expect(msg).toBe("Comment not found")
                    
                })
        })
    })
})