jest.mock("../db", () => require("./__mocks__/testDB.js"));
const request = require("supertest");
const express = require("express");

const mealMenusRouter = require("../routes/mealMenus/mealMenus");
const { getDB, initDB } = require("../db");

const app = express();
app.use(express.json());
app.use("/meal-menus", mealMenusRouter);

beforeAll(() => {
  jest.clearAllMocks();
  initDB();
});

describe("API /meal-menus/", () => {
  describe("GET /meal-menus/", () => {
    test("should return all meal menus", async () => {
      const db = getDB();
      db.all.mockImplementation((query, params, cb) => {
        cb(null, []);
      });

      const res = await request(app).get("/meal-menus/all");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.menus)).toBe(true);
    });

    test("should return meal menus by date", async () => {
      const db = getDB();
      db.get.mockImplementation((query, params, cb) => {
        cb(null, []);
      });

      const res = await request(app).get("/meal-menus/01-01-2024");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.menus)).toBe(true);
    });
  });
});
