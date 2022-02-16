const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

afterAll(()=> db.end())
beforeEach(() => seed(testData));



describe('All wrong paths return a status 404 and a message  "Path not found"', () => {
    test('/api/topis', () => {
        return request(app).get("/api/topis").expect(404).then(({body}) => {
            expect(body.msg).toBe("Path not found")
        });
    });

    test('/api/tipics', () => {
        return request(app).get("/api/tipics").expect(404).then(({body})=> {
            expect(body.msg).toBe("Path not found")
        })
    })
});

describe("/api/topics", () => {
    describe("GET", () => {
        test('Status 200, responds with an array', () => {
            return request(app).get('/api/topics').expect(200).then(({body:topics}) => {
                expect(topics.topics.constructor).toBe(Array)
            })
        })
        test('Status 200, the objects on the response contain the keys "slug" "description"', () => {
            return request(app).get("/api/topics").expect(200).then((({body: response}) => {
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
            return request(app).get("/api/articles/1").expect(200).then(({body:{article}}) => {
                console.log(article)
                expect(article).toEqual({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 100
                  }             
                )
            })
        });
        
        test('Status 404 for valid requests not found', () => {
            return request(app).get("/api/articles/90000").expect(404).then(({body}) => {
                expect(body.msg).toBe('Article not found')
            })
            
        })

        test('Status 400 for invalid requests', () => {
            return request(app).get('/api/articles/string').expect(400).then(({body}) => {
                
                expect(body.msg).toBe('Bad request')
            })
        })

        
    })


    describe('PATCH', () => {
        test('status 200, if the id is valid and exist in the database, the API responds with the updated article', () => {
             const article1 = {
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100
              }
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

        test('status 400, article not found', () => {
            return request(app).patch("/api/articles/90000").send({inc_votes: 1}).send(404).then((mistery) => {
                console.log(mistery.body)
            })

        })
    })

})