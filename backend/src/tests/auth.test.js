jest.mock("../db", () => require("./__mocks__/testDB.js"));
const request = require("supertest");
const express = require("express");
const { authRouter } = require("../routes/auth");
const { getDB, initDB } = require("../db");

const app = express();
app.use(express.json());
app.use("/login", authRouter);

beforeEach(() => {
  jest.clearAllMocks();
  initDB();
});

test("login emp success", async () => {
  const db = getDB();
  db.get.mockImplementation((query, params, cb) => {
    cb(null, { EMP_ID: params[0] });
  });

  const res = await request(app)
    .post("/login/employee")
    .send({ emp_id: "NV001" });

  expect(db.get).toHaveBeenCalledTimes(1);
  expect(res.statusCode).toBe(200);
  console.log(res.body);
  expect(res.body).toHaveProperty("token");
});

test("login emp fails", async () => {
  const db = getDB();
  db.get.mockImplementation((query, params, cb) => {
    cb(null, undefined);
  });

  const res = await request(app)
    .post("/login/employee")
    .send({ emp_id: "INVALID" });

  expect(db.get).toHaveBeenCalledTimes(1);
  expect(res.statusCode).toBe(401);
});
