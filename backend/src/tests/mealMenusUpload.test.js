jest.mock("../db", () => require("./__mocks__/testDB.js"));
const request = require("supertest");
const express = require("express");
const XLSX = require("xlsx");

const mealMenusRouter = require("@routes/mealMenus/mealMenusUpload");
const { getDB, initDB } = require("@db");

const app = express();
app.use(express.json());
app.use("/meal-menus", mealMenusRouter);

beforeAll(() => {
  jest.clearAllMocks();
  initDB();
});

describe("POST /meal-menus/", () => {
  test("should return 400 if no file uploaded", async () => {
    const res = await request(app).post("/meal-menus/upload");

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/file/i);
  });

  test("should return 400 if menu_date is missing", async () => {
    const res = await request(app)
      .post("/meal-menus/upload")
      .attach("file", Buffer.from("wrong file name"), "test.xlsx");

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/menu_date/i);
  });

  test("upload success", async () => {
    // Prepare mock rows to insert, fake data empty objects for testing
    const data = [
      ["", "Ca trưa", "Thứ 2 VI", "Thứ 2 EN", "Thứ 3 VI", "Thứ 3 EN"],
      [
        "Món chính",
        "Món chính",
        "Cơm gà",
        "Chicken rice",
        "Cơm sườn",
        "Pork rice",
      ],
    ];
    const sheet = XLSX.utils.json_to_sheet(data);

    // Create a real Excel buffer with the mockRows
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
    const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Spy on db.run to simulate successful insertions and deletions
    const db = getDB();
    db.all.mockImplementation((query, params, cb) => {
      cb(null, []);
    });
    db.run.mockImplementation((query, params, cb) => {
      this.lastID = 123; // file_id mock
      cb(null);
    });

    // Spy on XLSX.read to return our workbook
    const xlsxReadSpy = jest.spyOn(XLSX, "read").mockReturnValue(workbook);

    const res = await request(app)
      .post("/meal-menus/upload")
      .attach("file", buf, "Copy of CTTV - Thực đơn tuần 4.T7.xlsx");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.menus)).toBe(true);
    expect(res.body.menus.length).toBeGreaterThan(0);

    xlsxReadSpy.mockRestore();
  });
});

describe("GET meal-menus/file/:file_id/download", () => {
  const file_id = 123;
  const file_name = "Copy of CTTV - Thực đơn tuần 4.T7.xlsx";

  test("should return an Excel file for valid file_id", async () => {
    const db = getDB();
    db.get.mockImplementation((query, params, cb) => {
      cb(null, { FILE_ID: file_id, FILE_NAME: file_name });
    });
    db.all.mockImplementation((query, params, cb) => {
      cb(null, [
        {
          MENU_DATE: "2025-07-01",
          DISH_TYPE: "Món chính",
          NAME_VI: "Cơm gà",
          NAME_EN: "Chicken rice",
        },
        {
          MENU_DATE: "2025-07-02",
          DISH_TYPE: "Món chính",
          NAME_VI: "Cá kho",
          NAME_EN: "Braised fish",
        },
      ]);
    });

    const res = await request(app)
      .get(`/meal-menus/file/${file_id}/download`)
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
    expect(res.header["content-disposition"]).toContain(
      encodeURIComponent(file_name)
    );
    expect(res.body).toBeInstanceOf(Buffer);
    expect(res.body.length).toBeGreaterThan(0);

    //check if the Excel file has correct structure
    const workbook = XLSX.read(res.body, { type: "buffer" });
    const sheet = workbook.Sheets["Menus"];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    expect(data[0]).toEqual(
      expect.arrayContaining([
        "STT",
        "Dish Type",
        expect.stringContaining("vi"),
      ])
    );
    expect(data.length).toBeGreaterThan(1);
  });
});

describe("DELETE /meal-menus/file/:file_id/delete", () => {
  const file_id = 123;
  const file_name = "Copy of CTTV - Thực đơn tuần 4.T7.xlsx";

  test("should delete file and related menus if found", async () => {
    const db = getDB();

    db.get.mockImplementation((query, params, cb) => {
      cb(null, { FILE_ID: file_id, FILE_NAME: file_name });
    });

    db.run.mockImplementation((query, params, cb) => {
      cb?.(null);
    });

    const res = await request(app).delete(`/meal-menus/file/${file_id}/delete`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.deleted_file).toBe(file_name);
    expect(db.get).toHaveBeenCalledWith(
      "SELECT * FROM MEAL_MENU_FILES WHERE FILE_ID = ?",
      [file_id],
      expect.any(Function)
    );
    expect(db.run).toHaveBeenCalledTimes(7); // 2 deletes + 5 inserts
  });
});

describe("DELETE /meal-menus/files/delete", () => {
  const fileIds = [101, 102];
  const fakeFiles = {
    101: { FILE_ID: 101, FILE_NAME: "menu1.xlsx" },
    102: { FILE_ID: 102, FILE_NAME: "menu2.xlsx" },
  };

  beforeEach(() => {
    const db = getDB();

    db.get.mockImplementation((query, params, cb) => {
      const file_id = Number(params[0]);
      cb(null, fakeFiles[file_id] || null);
    });

    db.run.mockImplementation((query, params, cb) => {
      if (cb) cb(null);
    });
  });

  it("should delete multiple files and return deleted file names", async () => {
    const res = await request(app)
      .delete("/meal-menus/files/delete")
      .send({ fileIds });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.deleted_files).toEqual(
      expect.arrayContaining(["menu1.xlsx", "menu2.xlsx"])
    );

    const db = getDB();
    expect(db.get).toHaveBeenCalledTimes(4); // 2 for each file_id
    expect(db.run).toHaveBeenCalledWith(
      "DELETE FROM MEAL_MENUS WHERE FILE_ID = ?",
      [101]
    );
    expect(db.run).toHaveBeenCalledWith(
      "DELETE FROM MEAL_MENU_FILES WHERE FILE_ID = ?",
      [101]
    );
    expect(db.run).toHaveBeenCalledWith(
      "DELETE FROM MEAL_MENUS WHERE FILE_ID = ?",
      [102]
    );
    expect(db.run).toHaveBeenCalledWith(
      "DELETE FROM MEAL_MENU_FILES WHERE FILE_ID = ?",
      [102]
    );
  });
});
