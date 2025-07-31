jest.mock("../db", () => require("./__mocks__/testDB.js"));
const request = require("supertest");
const express = require("express");

const { authRouter } = require("../routes/auth/auth");
const { getDB, initDB } = require("../db");

const app = express();
app.use(express.json());
app.use("/login", authRouter);

beforeEach(() => {
  jest.clearAllMocks();
  initDB();
});

describe("API /login", () => {
  describe("employee", () => {
    test("login emp success", async () => {
      const db = getDB();
      db.get.mockImplementation((query, params, cb) => {
        cb(null, { emp_id: params[0] });
      });

      const res = await request(app)
        .get("/login/employee")
        .send({ emp_id: "NV001" });

      expect(db.get).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    test("login emp fails", async () => {
      const db = getDB();
      db.get.mockImplementation((query, params, cb) => {
        cb(null, undefined);
      });

      const res = await request(app)
        .get("/login/employee")
        .send({ emp_id: "INVALID" });

      expect(db.get).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toBe(401);
    });
  });

  describe("admin", () => {
    test("login admin success", async () => {
      const db = getDB();
      db.get.mockImplementation((query, params, cb) => {
        cb(null, { admin_id: params[0] });
      });

      const res = await request(app)
        .get("/login/admin")
        .send({ username: "admin", password: "password" });

      expect(db.get).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    test("login admin fails", async () => {
      const db = getDB();
      db.get.mockImplementation((query, params, cb) => {
        cb(null, undefined);
      });

      const res = await request(app)
        .get("/login/admin")
        .send({ username: "INVALID", password: "INVALID" });

      expect(db.get).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toBe(401);
    });
  });
});
