"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Company = require("../models/company");
const Job = require("../models/job");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  // Clear existing data
  await db.query("DELETE FROM applications");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM companies");
  await db.query("DELETE FROM jobs");
  await db.query("SELECT setval(pg_get_serial_sequence('jobs', 'id'), 1, false)");

  // Create companies
  await Company.create({
    handle: "c1",
    name: "C1",
    numEmployees: 1,
    description: "Desc1",
    logoUrl: "http://c1.img",
  });

  await Company.create({
    handle: "c2",
    name: "C2",
    numEmployees: 2,
    description: "Desc2",
    logoUrl: "http://c2.img",
  });

  await Company.create({
    handle: "c3",
    name: "C3",
    numEmployees: 3,
    description: "Desc3",
    logoUrl: "http://c3.img",
  });

  // Create users
  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });

  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });

  await User.register({
    username: "admin",
    firstName: "AdminF",
    lastName: "AdminL",
    email: "admin@user.com",
    password: "password",
    isAdmin: true,
  });

  // Create jobs
  const job1 = await Job.create({
    title: "Job1",
    salary: 50000,
    equity: "0.05",
    companyHandle: "c1",
  });

  const job2 = await Job.create({
    title: "Job2",
    salary: 60000,
    equity: "0.07",
    companyHandle: "c2",
  });

  const job3 = await Job.create({
    title: "Job3",
    salary: 70000,
    equity: "0.1",
    companyHandle: "c3",
  });

  // Create applications for user u1
  await db.query(
    `INSERT INTO applications (username, job_id)
     VALUES ($1, $2), ($1, $3)`,
    ["u1", job1.id, job2.id]
  );
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

// Create tokens for users
const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
};
