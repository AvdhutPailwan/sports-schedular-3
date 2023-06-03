const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name = _csrf]").val();
}

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
    const res = await agent.get("/createSession");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/sportSession").send({
      time: new Date().toISOString(),
      place: "Admin Backyard",
      players: "A,B,C,D",
      noOfPlayers: 12,
      _csrf: csrfToken,
    });
    // console.log(response)
    expect(response.statusCode).toBe(302);
  });
  // test("responds with id on /sportSession/:id", async () => {
  //   let res = await agent.get('/createSession')
  //   let csrfToken = extractCsrfToken(res);
  //   const response = await agent
  //     .post("/sportSession")
  //     .send({
  //       time: new Date().toISOString(),
  //       place: "Admin Backyard",
  //       players: "A,B,C,D",
  //       noOfPlayers: 12,
  //       "_csrf": csrfToken,
  //     })
  // console.log(response);
  // expect(response.status).toBe(200);
  // expect(response.header["content-type"]).toBe(
  //   "application/json; charset=utf-8"
  // );

  // const parsedResponse = JSON.parse(response.text);
  // expect(parsedResponse.id).toBeDefined();

  // const id = parsedResponse.id.toString();
  // const delResponse = await agent
  //   .delete("/sportSession")
  //   .send({ id })

  // console.log(delResponse.body);
  // expect(delResponse.status).toBe(200);
  // expect(response.header["content-type"]).toBe(
  //   "application/json; charset=utf-8"
  // );
  // const delParsedResponse = JSON.parse(delResponse.text);
  // expect(delParsedResponse).toBe(id);
  // });
});
