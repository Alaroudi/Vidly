const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");
const request = require("supertest");

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Genre.deleteMany({});
    await server.close();
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(server)
      .post("/api/genres")
      .send({ name: "genre1" });
    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    const res = await request(server)
      .post("/api/genres")
      .set("x-auth-token", "1234")
      .send({ name: "genre1" });
    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    const token = new User().generateAuthToken();
    const res = await request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
    expect(res.status).toBe(200);
  });
});
