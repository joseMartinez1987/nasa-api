const { response } = require("express");
const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  
    beforeAll(async() => {
        await mongoConnect()
    })
    afterAll(async() => {
        await mongDisconnect()
    })

  describe("Test GET / launches", () => {
    test("It should responde with 200 success", async () => {
      /* ONE MANNER TO*/
      // const response = await request(app).get('/lauches')
      // expect(response.statusCode).toBe(200)

      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /launch", () => {
    const completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "Janaury 4, 2028",
    };

    const launchDateWithoutData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
    };

    const launchDateWithInvalidDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "xoot",
    };

    test("It should responde with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(requestDate).toBe(responseDate);
      expect(response.body).toMatchObject(launchDateWithoutData);
    });

    test("It should catch missing requires properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDateWithoutData)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    test("It should catch incalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDateWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
