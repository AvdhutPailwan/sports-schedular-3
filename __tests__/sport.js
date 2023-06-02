const request = require("supertest");

const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Session test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(5000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });
  test("responds with json at /sportSession", async () => {
    const response = await agent.post("/sportSession").send({
      time: new Date().toISOString(),
      place: "Admin Backyard",
      players: "A,B,C,D",
      noOfPlayers: 12,
    });
    // console.log(response)
    expect(response.status).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );

    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });
  test("responds with id on /sportSession/:id", async () => {
    const response = await agent.post("/sportSession").send({
      time: new Date().toISOString(),
      place: "Admin Backyard",
      players: "A,B,C,D",
      noOfPlayers: 12,
    });
    console.log(response);
    expect(response.status).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );

    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();

    const id = parsedResponse.id.toString();
    const delResponse = await agent.delete("/sportSession/" + id);
    // console.log(delResponse)
    expect(delResponse.status).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    const delParsedResponse = JSON.parse(delResponse.text);
    expect(delParsedResponse).toBe(id);
  });
});
