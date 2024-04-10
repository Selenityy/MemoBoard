const request = require("supertest");
const app = require("./testApp");
const db = require("./mongoConfigTesting");

let token = "";
let userId = "";
let memoId = "";

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
});

afterAll(async () => {
  await db.stopMongoServer();
});

test("should successfully display all parent memos", async () => {
  // Create a second parent memo
  await request(app)
    .post(`/dashboard/memos/create`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      body: "A second test memo",
      progress: "Not Started",
      notes: "Test notes for a second test meom.",
    });

  const res = await request(app)
    .get(`/dashboard/memos`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.body.message).toEqual("Successfully retrieved all parent memos");

  const normalizedMemos = res.body.parentMemos.map((memo) => ({
    body: memo.body,
    progress: memo.progress,
    notes: memo.notes,
  }));
  expect(normalizedMemos).toEqual(
    expect.objectContaining([
      {
        body: "A test memo",
        progress: "Not Started",
        notes: "Test notes for a test meom.",
      },
      {
        body: "A second test memo",
        progress: "Not Started",
        notes: "Test notes for a second test meom.",
      },
    ])
  );
});

test("should display a specific parent memo", async () => {
  const res = await request(app)
    .get(`/dashboard/memos/${memoId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.body.message).toEqual(
    "Successfully retrieved a specific parent memo"
  );
  expect(res.body.parentMemo).toEqual(
    expect.objectContaining({
      body: "A test memo",
      progress: "Not Started",
      notes: "Test notes for a test meom.",
    })
  );
});

test("should successfully get all children of a parent memo", async () => {
  // Create a child memo
  await request(app)
    .post(`/dashboard/memos/create`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      body: "A child test memo",
      progress: "Not Started",
      notes: "Test notes for a child test meom.",
      parentId: memoId,
    });

  const res = await request(app)
    .get(`/dashboard/memos/${memoId}/children`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.body.message).toEqual("Successfully retrieved all children memos");

  const normalizedChildMemos = res.body.childMemos.map((memo) => ({
    body: memo.body,
    progress: memo.progress,
    notes: memo.notes,
  }));
  expect(normalizedChildMemos).toEqual(
    expect.objectContaining([
      {
        body: "A child test memo",
        progress: "Not Started",
        notes: "Test notes for a child test meom.",
      },
    ])
  );
});

test("should successfully create a parent memo", async () => {
  const res = await request(app)
    .post("/dashboard/memos/create")
    .set("Authorization", `Bearer ${token}`)
    .send({
      body: "Walk outside for 30min",
      progress: "Not Started",
      notes: "Stop by Trader Joes to grab some dinner on the way back home.",
    });
  expect(res.statusCode).toEqual(201);
  expect(res.body.message).toEqual("Memo created successfully");
  expect(res.body.newMemo).toEqual(
    expect.objectContaining({
      body: "Walk outside for 30min",
      progress: "Not Started",
      notes: "Stop by Trader Joes to grab some dinner on the way back home.",
    })
  );
});

test("should successfully update a memo", async () => {
  const res = await request(app)
    .put(`/dashboard/memos/${memoId}/update`)
    .set("Authorization", `Bearer ${token}`)
    .send({ body: "Updated test memo" });
  expect(res.body.message).toEqual(
    "Successfully updated a specific parent memo"
  );
  expect(res.body.updatedMemo).toEqual(
    expect.objectContaining({
      body: "Updated test memo",
    })
  );
});

test("should successfully delete a memo", async () => {
  const delRes = await request(app)
    .delete(`/dashboard/memos/${memoId}/delete`)
    .set("Authorization", `Bearer ${token}`);
  console.log(delRes.body);
  expect(delRes.statusCode).toEqual(204);

  const checkRes = await request(app)
    .get(`/dashboard/memos/${memoId}`)
    .set("Authorization", `Bearer ${token}`);

  expect(checkRes.statusCode).toEqual(404);
});

// create a child memo
