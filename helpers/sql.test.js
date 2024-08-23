const { sqlForPartialUpdate } = require("./sql");
const { BadRequestError } = require("../expressError");

describe("sqlForPartialUpdate", () => {
  test("works: partial update with one field", () => {
    const dataToUpdate = { firstName: "Aliya" };
    const jsToSql = { firstName: "first_name" };
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
    expect(result).toEqual({
      setCols: '"first_name"=$1',
      values: ["Aliya"],
    });
  });

  test("works: partial update with multiple fields", () => {
    const dataToUpdate = { firstName: "Aliya", age: 32 };
    const jsToSql = { firstName: "first_name" };
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
    expect(result).toEqual({
      setCols: '"first_name"=$1, "age"=$2',
      values: ["Aliya", 32],
    });
  });

  test("works: with no jsToSql mapping", () => {
    const dataToUpdate = { firstName: "Aliya", age: 32 };
    const result = sqlForPartialUpdate(dataToUpdate);
    expect(result).toEqual({
      setCols: '"firstName"=$1, "age"=$2',
      values: ["Aliya", 32],
    });
  });
  
  test("throws BadRequestError if no data provided", () => {
    expect(() => {
      sqlForPartialUpdate({}, {});
    }).toThrow(BadRequestError);
  });

  test("works: with jsToSql mapping for all fields", () => {
    const dataToUpdate = { firstName: "Aliya", lastName: "Smith" };
    const jsToSql = { firstName: "first_name", lastName: "last_name" };
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
    expect(result).toEqual({
      setCols: '"first_name"=$1, "last_name"=$2',
      values: ["Aliya", "Smith"],
    });
  });
});
