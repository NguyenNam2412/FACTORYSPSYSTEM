let mockDB;
function initDB() {
  mockDB = {
    // serialize: jest.fn(),
    // prepare: jest.fn(),
    // finalize: jest.fn(),
    get: jest.fn(),
    all: jest.fn(),
    run: jest.fn(),
    // close: jest.fn(),
  };
}
function getDB() {
  return mockDB;
}
module.exports = { initDB, getDB };
