const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  // Clean up the data
  await db.query("DELETE FROM companies");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM jobs");

  // Insert companies
  await db.query(`
    INSERT INTO companies(handle, name, num_employees, description, logo_url)
    VALUES ('c1', 'C1', 1, 'Desc1', 'http://c1.img'),
           ('c2', 'C2', 2, 'Desc2', 'http://c2.img'),
           ('c3', 'C3', 3, 'Desc3', 'http://c3.img')`);

  // Insert users, including an admin user
  await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email,
                          is_admin)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com', false),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com', false),
               ('admin', $3, 'Admin', 'User', 'admin@email.com', true)
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("adminpass", BCRYPT_WORK_FACTOR),
      ]);

  // Insert jobs
  await db.query(`
    INSERT INTO jobs (title, salary, equity, company_handle)
    VALUES ('j1', 10000, '0.1', 'c1'),
           ('j2', 20000, '0', 'c1')`);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};
