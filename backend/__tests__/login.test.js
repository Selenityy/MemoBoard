const request = require("supertest");
const app = require("../helpers/testApp");
const db = require("../helpers/mongoConfigTesting");

beforeAll(async () => {
  await db.startMongoServer();
});

beforeEach(async () => {
  await db.clearMongoServer();
  await request(app).post("/auth/signup").send({
    username: "jestTest",
    password: "jest",
    email: "jestTest@example.com",
    firstName: "Jest",
    lastName: "Test",
    timezone: "CT",
  });
});

afterAll(async () => {
  await db.stopMongoServer();
});

test("should login an existing user", async () => {
  const res = await request(app).post("/auth/login").send({
    username: "jestTest",
    password: "jest",
  });
  expect(res.statusCode).toEqual(200);
  expect(res.body.message).toEqual("Login successful.");
});
