const request = require("supertest");
const app = require("../helpers/testApp");
const db = require("../helpers/mongoConfigTesting");

let token = "";
let userId = "";

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
  const res = await request(app).post("/auth/login").send({
    identifier: "jestTest",
    password: "jest",
  });
  token = res.body.token;
  userId = res.body.user._id;
});

afterAll(async () => {
  await db.stopMongoServer();
});

test("should successfully get to the protected route", async () => {
  const res = await request(app)
    .get("/dashboard")
    .set("Authorization", `Bearer ${token}`);
  expect(res.body.message).toEqual("Successful login to protected routes");
});

test("should get the user profile data", async () => {
  const res = await request(app)
    .get("/dashboard/data")
    .set("Authorization", `Bearer ${token}`);
  expect(res.body.message).toEqual("Successfully retrieved user profile data.");
  expect(res.body.user).toEqual(
    expect.objectContaining({
      _id: userId,
      firstName: "Jest",
      lastName: "Test",
      username: "jestTest",
      email: "jesttest@example.com",
      timezone: "CT",
    })
  );
});

test("should update the email", async () => {
  const res = await request(app)
    .put(`/dashboard/${userId}/updateEmail`)
    .set("Authorization", `Bearer ${token}`)
    .send({ newEmail: "jesttest2@example.com" });
  expect(res.body.message).toEqual("Successfully updated email.");
});

test("should error when trying to update the email", async () => {
  const res = await request(app)
    .put(`/dashboard/${userId}/updateEmail`)
    .set("Authorization", `Bearer ${token}`)
    .send({ newEmail: "" });
  expect(res.statusCode).toEqual(400);
  expect(res.body.message).toEqual("Email is required.");
});

test("should update the name", async () => {
  const res = await request(app)
    .put(`/dashboard/${userId}/updateName`)
    .set("Authorization", `Bearer ${token}`)
    .send({ newFirstName: "Test", newLastName: "Jest" });
  expect(res.body.message).toEqual("Successfully updated full name.");
  expect(res.body.user.firstName).toEqual("Test");
  expect(res.body.user.lastName).toEqual("Jest");
});

test("should error when trying to update the name", async () => {
  const res = await request(app)
    .put(`/dashboard/${userId}/updateName`)
    .set("Authorization", `Bearer ${token}`)
    .send({ newFirstName: "", newLastName: "" });
  expect(res.statusCode).toEqual(400);
  expect(res.body.message).toEqual("First and last name is required.");
});

test("should update the username", async () => {
  const res = await request(app)
    .put(`/dashboard/${userId}/updateUsername`)
    .set("Authorization", `Bearer ${token}`)
    .send({ newUsername: "JestTestAccount" });
  expect(res.body.message).toEqual("Successfully updated username.");
  expect(res.body.username).toEqual("JestTestAccount");
});

test("should error when trying to update the username", async () => {
  const res = await request(app)
    .put(`/dashboard/${userId}/updateUsername`)
    .set("Authorization", `Bearer ${token}`)
    .send({ newUsername: "" });
  expect(res.statusCode).toEqual(400);
  expect(res.body.message).toEqual("Username is required");
});

test("should update the timezone", async () => {
  const res = await request(app)
    .put(`/dashboard/${userId}/updateTimezone`)
    .set("Authorization", `Bearer ${token}`)
    .send({ newTimezone: "ET" });
  expect(res.body.message).toEqual("Successfully updated timezone.");
  expect(res.body.timezone).toEqual("ET");
});

test("should error when trying to update the username", async () => {
  const res = await request(app)
    .put(`/dashboard/${userId}/updateTimezone`)
    .set("Authorization", `Bearer ${token}`)
    .send({ newTimezone: "" });
  expect(res.statusCode).toEqual(400);
  expect(res.body.message).toEqual("Timezone is required.");
});

test("should delete the account and all related memos/tags", async () => {
  const res = await request(app)
    .delete(`/dashboard/${userId}/account`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.statusCode).toEqual(200);
  expect(res.body.message).toEqual(
    "User account and all related memos and tags have been successfully deleted."
  );
});
