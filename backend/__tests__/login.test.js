const request = require("supertest");
const app = require("./testApp");
const db = require("./mongoConfigTesting");

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
  console.log(res);
  expect(res.statusCode).toEqual(200);
});
