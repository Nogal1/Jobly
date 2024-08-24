"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Company = require("../models/company");
const Job = require("../models/job"); // Import Job model
const { createToken } = require("../helpers/tokens");


async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM companies");
  await db.query("DELETE FROM jobs"); // Clear jobs table
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

  await Company.create({
    handle: "c4",
    name: "C4",
    numEmployees: 1,
    description: "Desc4",
    logoUrl: "http://c4.img",
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
    isAdmin: true, // This user is an admin
  });

 // Create jobs and store their IDs
  await Job.create({
  title: "Job1",
  salary: 50000,
  equity: "0.05",
  companyHandle: "c1",
});


  await Job.create({
  title: "Job2",
  salary: 60000,
  equity: "0.07",
  companyHandle: "c2",
});


  await Job.create({
  title: "Job3",
  salary: 70000,
  equity: "0.1",
  companyHandle: "c3",
});

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
const adminToken = createToken({ username: "admin", isAdmin: true });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  adminToken, // Export the adminToken
};
