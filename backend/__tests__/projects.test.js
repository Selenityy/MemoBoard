const request = require("supertest");
const app = require("../helpers/testApp");
const db = require("../helpers/mongoConfigTesting");

let token = "";
let userId = "";
let projectId = "";

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
    identifier: "jestTest",
    password: "jest",
  });
  //   console.log(loginRes);
  token = loginRes.body.token;
  userId = loginRes.body.user._id;

  //   const memoRes = await request(app)
  //     .post(`/dashboard/memos/create`)
  //     .set("Authorization", `Bearer ${token}`)
  //     .send({
  //       body: "A test memo",
  //       progress: "Not Started",
  //       notes: "Test notes for a test meom.",
  //     });
  //   memoId = memoRes.body.newMemo._id;
});

afterAll(async () => {
  await db.stopMongoServer();
});

test("should successfully create a project", async () => {
  const res = await request(app)
    .post(`/dashboard/projects/create`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Test Project Title",
      description: "",
    });
  expect(res.statusCode).toEqual(201);
  expect(res.body.newProject).toEqual(
    expect.objectContaining({
      name: "Test Project Title",
    })
  );
  expect(res.body.newProject).toEqual(
    expect.objectContaining({
      description: "",
    })
  );
});
