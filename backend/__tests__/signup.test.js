const request = require("supertest");
const app = require("../helpers/testApp");
const db = require("../helpers/mongoConfigTesting");

beforeAll(async () => {
  await db.startMongoServer();
});

beforeEach(async () => {
  await db.clearMongoServer();
});

afterAll(async () => {
  await db.stopMongoServer();
});

test("should sign up a new user successfully", async () => {
  const res = await request(app).post("/auth/signup").send({
    username: "jestTest",
    password: "jest",
    email: "jestTest@example.com",
    firstName: "Jest",
    lastName: "Test",
    timezone: "CT",
  });
  expect(res.statusCode).toEqual(201);
  expect(res.body.message).toEqual("User created successfully");
});

test("should reject username for already existing", async () => {
  const res = await request(app).post("/auth/signup").send({
    username: "jestTest",
    password: "jest",
    email: "jestTest@example.com",
    firstName: "Jest",
    lastName: "Test",
    timezone: "CT",
  });
  const res2 = await request(app).post("/auth/signup").send({
    username: "jestTest",
    password: "jest",
    email: "jestTest@example.com",
    firstName: "Jest",
    lastName: "Test",
    timezone: "CT",
  });
  expect(res2.statusCode).toEqual(400);
  expect(res2.body.message).toEqual("Username or email already exists");
});

test("should error with email and password required", async () => {
  const res = await request(app).post("/auth/signup").send({
    username: "jestTest",
    password: "",
    email: "",
    firstName: "Jest",
    lastName: "Test",
    timezone: "CT",
  });
  expect(res.statusCode).toEqual(400);
  expect(res.body.message).toEqual("Email and password are requried");
});
