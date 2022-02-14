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
                expect(topics.constructor).toBe(Array)
            })
        })
        test('Status 200, the objects on the response contain the keys "slug" "description"', () => {
            return request(app).get("/api/topics").expect(200).then((({body: topics}) => {
                topics.forEach((topic) => {
                    expect(topic).toEqual(
                        expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String),
                        
                    }));
                });
                

            }))
            
        })
    })
})