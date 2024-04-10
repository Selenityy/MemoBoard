const request = require("supertest");
const app = require("./testApp");
const db = require("./mongoConfigTesting");

let token = "";
let userId = "";
let memoId = "";
let tagId = "";

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

  const loginRes = await request(app).post("/auth/login").send({
    username: "jestTest",
    password: "jest",
  });
  token = loginRes.body.token;
  userId = loginRes.body.user._id;

  const memoRes = await request(app)
    .post(`/dashboard/memos/create`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      body: "A test memo",
      progress: "Not Started",
      notes: "Test notes for a test meom.",
    });
  memoId = memoRes.body.newMemo._id;

  const tagRes = await request(app)
    .post(`/dashboard/tags/create`)
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Test Tag", user: userId });
  tagId = tagRes.body.newTag._id;
});

afterAll(async () => {
  await db.stopMongoServer();
});

test("should display all tags", async () => {
  await request(app)
    .post(`/dashboard/tags/create`)
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Appointment", user: userId });

  const res = await request(app)
    .get(`/dashboard/tags/`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.body.message).toEqual("Successfully retrieved all tags");

  const normalizedTags = res.body.tags.map((tag) => ({
    name: tag.name,
  }));
  expect(normalizedTags).toEqual(
    expect.objectContaining([
      {
        name: "Test Tag",
      },
      {
        name: "Appointment",
      },
    ])
  );
});

test("should create a tag", async () => {
  const res = await request(app)
    .post(`/dashboard/tags/create`)
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Appointment", user: userId });
  expect(res.statusCode).toEqual(201);
  expect(res.body.newTag).toEqual(
    expect.objectContaining({ name: "Appointment", user: userId })
  );
});

test("should update an existing tag", async () => {
  const res = await request(app)
    .put(`/dashboard/tags/${tagId}/update`)
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Updated Tag" });
  expect(res.body.message).toEqual("Successfully updated a tag");
  expect(res.body.updatedTag).toEqual(
    expect.objectContaining({
      name: "Updated Tag",
    })
  );
});

test("should delete a tag", async () => {
  const res = await request(app)
    .delete(`/dashboard/tags/${tagId}/delete`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.statusCode).toEqual(204);
});
