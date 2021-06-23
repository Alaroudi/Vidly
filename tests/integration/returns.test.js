const mongoose = require("mongoose");
const { Rental } = require("../../models/rental");
const request = require("supertest");

describe("/api/returns", () => {
  let server;
  let rental;
  let customerId = mongoose.Types.ObjectId();
  let movieId = mongoose.Types.ObjectId();
  beforeEach(async () => {
    server = require("../../index");
    rental = new Rental({
      customer: {
        _id: customerId,
        name: "abcde",
        phone: "12345678910",
      },
      movie: {
        _id: movieId,
        genre: "genr1",
        title: "movie1",
        dailyRentalRate: 2,
      },
    });

    await rental.save();
  });
  afterEach(async () => {
    await Rental.deleteMany({});
    await server.close();
  });

  it("should return 401 if client is not logged in", async () => {
    const res = await request(server)
      .post("/api/returns")
      .send({ customerId: customerId, movieId: movieId });

    expect(res.status).toBe(401);
  });
});
