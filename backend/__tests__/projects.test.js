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
  token = loginRes.body.token;
  userId = loginRes.body.user._id;

  const projectRes = await request(app)
    .post(`/dashboard/projects/create`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Home Improvements",
      description: "Inspired by my mood board",
    });
  projectId = projectRes.body.newProject._id;
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

test("should fetch all projects", async () => {
  await request(app)
    .post(`/dashboard/projects/create`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Test Project Title",
      description: "",
    });

  const res = await request(app)
    .get(`/dashboard/projects`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.body.message).toEqual("Successfully retrieved all projects");

  const normalizedProjects = res.body.projects.map((project) => ({
    name: project.name,
    description: project.description,
  }));
  expect(normalizedProjects).toEqual(
    expect.objectContaining([
      {
        name: "Home Improvements",
        description: "Inspired by my mood board",
      },
      {
        name: "Test Project Title",
        description: "",
      },
    ])
  );
});

test("should fetch a specific project", async () => {
  const res = await request(app)
    .get(`/dashboard/projects/${projectId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.body.message).toEqual("Successfully retrieved a specific project");
  expect(res.body.project).toEqual(
    expect.objectContaining({
      name: "Home Improvements",
      description: "Inspired by my mood board",
    })
  );
});

test("should display memos of a specific project", async () => {
  const memoRes = await request(app)
    .post(`/dashboard/memos/create`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      body: "A test memo",
      progress: "Not Started",
      notes: "Test notes for a test memo.",
      project: projectId,
    });
  const memoId = memoRes.body.newMemo._id;

  const res = await request(app)
    .get(`/dashboard/projects/${projectId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.body.project.memos).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        _id: memoId,
        body: "A test memo",
        progress: "Not Started",
        notes: "Test notes for a test memo.",
      }),
    ])
  );
});

test("should update an existing project", async () => {
  const res = await request(app)
    .put(`/dashboard/projects/${projectId}/update`)
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Updated Home Improvements", description: "NY Apartment" });
  expect(res.body.message).toEqual("Successfully updated a specific project");
  expect(res.body.updatedProject).toEqual(
    expect.objectContaining({
      name: "Updated Home Improvements",
      description: "NY Apartment",
    })
  );
});

test("should delete a project", async () => {
  const delRes = await request(app)
    .delete(`/dashboard/projects/${projectId}/delete`)
    .set("Authorization", `Bearer ${token}`);
  expect(delRes.statusCode).toEqual(204);

  const checkRes = await request(app)
    .get(`/dashboard/projects/${projectId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(checkRes.statusCode).toEqual(404);
});
