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
        test('Status 200, responds with an Object', () => {
            return request(app).get("/api/articles/1").expect(200)
        })

        test('Status 200, the returned object has the correct keys and datatypes', () => {
            return request(app).get("/api/articles/1").expect(200).then(({body:{article}}) => {
                expect(article).toEqual(
                    expect.objectContaining({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                    })
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

})