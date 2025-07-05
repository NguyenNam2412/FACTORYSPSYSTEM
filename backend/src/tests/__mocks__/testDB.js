let mockDB;
function initDB() {
  mockDB = {
    get: jest.fn(),
    all: jest.fn(),
    run: jest.fn(),
  };
}
function getDB() {
  return mockDB;
}
module.exports = { initDB, getDB };
