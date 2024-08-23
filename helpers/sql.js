/**
 * Generates a SQL statement fragment for partially updating a database record.
 *
 * This function is useful when you want to dynamically generate a SQL `SET`
 * clause based on the fields that need to be updated in a table. It accepts
 * an object containing the data to update, and an optional mapping object that
 * translates JavaScript-style camelCase property names to SQL-style snake_case
 * column names.
 *
 * @param {Object} dataToUpdate - An object where keys are the fields to update and values are the new values.
 * @param {Object} jsToSql - An optional object to map JavaScript-style camelCase property names to SQL-style snake_case column names.
 * @returns {Object} An object containing:
 *   - `setCols`: A string representing the SQL `SET` clause (e.g., `"first_name"=$1, "age"=$2`).
 *   - `values`: An array of the new values to be used in the SQL query.
 *
 * @throws {BadRequestError} If no data is provided (i.e., if `dataToUpdate` is an empty object).
 *
 * @example
 * const dataToUpdate = { firstName: 'Aliya', age: 32 };
 * const jsToSql = { firstName: 'first_name' };
 * const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
 * // result = {
 * //   setCols: '"first_name"=$1, "age"=$2',
 * //   values: ['Aliya', 32]
 * // };
 */
const { BadRequestError } = require("../expressError");  // Add this line


function sqlForPartialUpdate(dataToUpdate, jsToSql = {}) {
  if (typeof jsToSql === 'undefined') {
    console.error("jsToSql is undefined");
  }
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}


module.exports = { sqlForPartialUpdate };
