jest.mock("../db", () => require("./__mocks__/testDB.js"));
const request = require("supertest");
const express = require("express");
const XLSX = require("xlsx");

const mealRegistrationsRouter = require("@routes/mealMenus/mealRegistrations");
const { getDB, initDB } = require("@db");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  const mockHeader = req.headers["x-mock-user"];
  if (mockHeader) {
    try {
      req.user = JSON.parse(mockHeader);
    } catch (e) {
      return res.status(400).json({ error: "Invalid mock user" });
    }
  }
  next();
});
app.use("/meal-registrations", mealRegistrationsRouter);

beforeAll(() => {
  jest.clearAllMocks();
  initDB();
});

describe("POST /meal-registrations/", () => {
  test("should return list meal of one emp", async () => {
    const db = getDB();
    db.all.mockImplementation((query, params, cb) => {
      cb(null, [
        {
          EMP_ID: "V123",
          LUNCH_REG:
            '[{"REG_DATE": "04/08/2025", "QTY": 1, "NOTE": "Test"}, {"REG_DATE": "05/08/2025", "QTY": 1, "NOTE": ""}]',
          DINNER_REG: "[]",
          BREAKFAST_REG: "[]",
        },
      ]);
    });

    const res = await request(app)
      .get(`/meal-registrations/my-reg`)
      .set(
        "X-Mock-User",
        JSON.stringify({
          emp_id: "V123",
        })
      )
      .query({
        reg_date: 1754265600000, // 04/08/2025
        dish_type: "LUNCH_REG",
      });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("should return list meal all emp", async () => {
    const db = getDB();
    db.all.mockImplementation((query, params, cb) => {
      cb(null, [
        {
          EMP_ID: "V123",
          FULL_NAME: "ABC",
          DEPARTMENT_ID: "IT",
          LUNCH_REG:
            '[{"REG_DATE": "04/08/2025", "QTY": 1, "NOTE": "Test"}, {"REG_DATE": "05/08/2025", "QTY": 1, "NOTE": ""}]',
          DINNER_REG: "[]",
          BREAKFAST_REG: "[]",
        },
      ]);
    });

    const res = await request(app)
      .get(`/meal-registrations/meal-reg`)
      .set(
        "X-Mock-User",
        JSON.stringify({
          emp_id: "V123",
        })
      )
      .query({
        reg_date: 1754265600000, // 04/08/2025
        dish_type: "LUNCH_REG",
      });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /meal-reg/export", () => {
  test("should export Excel file with meal registrations", async () => {
    const db = getDB();
    db.all.mockImplementation((query, params, cb) => {
      cb(null, [
        {
          EMP_ID: "V123",
          FULL_NAME: "ABC",
          DEPARTMENT_ID: "IT",
          LUNCH_REG:
            '[{"REG_DATE": "04/08/2025", "QTY": 1, "NOTE": "Test"}, {"REG_DATE": "05/08/2025", "QTY": 1, "NOTE": ""}]',
          DINNER_REG: "[]",
          BREAKFAST_REG: "[]",
        },
      ]);
    });

    const res = await request(app)
      .get("/meal-registrations/meal-reg/export")
      .set("X-Mock-User", JSON.stringify({ emp_id: "V123" }))
      .query({
        reg_date: 1754265600000, // 04/08/2025
        dish_type: "LUNCH_REG",
      })
      .buffer(true)
      .parse((res, callback) => {
        res.setEncoding("binary");
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => callback(null, Buffer.from(data, "binary")));
      });

    expect(res.statusCode).toBe(200);
    expect(res.header["content-type"]).toBe(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    expect(res.header["content-disposition"]).toContain("attachment;");
    expect(res.header["content-disposition"]).toContain(
      `attachment; filename*=UTF-8''${encodeURIComponent(
        `bảng theo dõi số lượng suất ăn ngày 04/08/2025.xlsx`
      )}`
    );
    expect(res.body).toBeInstanceOf(Buffer);
    expect(res.body.length).toBeGreaterThan(0);

    // Kiểm tra buffer có thể chuyển đổi thành Excel sheet
    const workbook = XLSX.read(res.body, { type: "buffer" });
    const sheetNames = workbook.SheetNames;
    expect(sheetNames.length).toBeGreaterThan(0);

    const worksheet = workbook.Sheets[sheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Kiểm tra dòng tiêu đề đầu tiên
    expect(data[0]).toEqual([
      "STT",
      "Ngày tháng",
      "Mã nhân viên",
      "Tên nhân viên",
      "Bộ phận",
      "Ghi chú",
    ]);
  });
});

describe("POST /assign", () => {
  test("should assign meals", async () => {
    const payload = {
      dish_type: "LUNCH_REG",
      reg_data:
        '[{"REG_DATE": "04/08/2025", "QTY": 1, "NOTE": "Test"}, {"REG_DATE": "05/08/2025", "QTY": 1, "NOTE": ""}]',
    };

    const db = getDB();
    jest.spyOn(db, "run").mockImplementation((sql, params, cb) => {
      cb(null);
    });

    const res = await request(app)
      .post("/meal-registrations/update")
      .set(
        "X-Mock-User",
        JSON.stringify({ emp_id: "V123", department_id: "IT" })
      )
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("assigned_data", payload.reg_data);

    // ensure db.run was called with expected SQL & params
    expect(db.run).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO MEAL_REGISTRATIONS"),
      ["V123", payload.reg_data],
      expect.any(Function)
    );
  });
});
