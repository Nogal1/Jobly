"use strict";

const db = require("../db");
const Job = require("./job");
const {
  NotFoundError,
} = require("../expressError");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "new",
    salary: 30000,
    equity: "0.2",
    companyHandle: "c1",
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({
      id: expect.any(Number),
      ...newJob,
    });
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: all jobs", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "j1",
        salary: 10000,
        equity: "0.1",
        companyHandle: "c1",
      },
      {
        id: expect.any(Number),
        title: "j2",
        salary: 20000,
        equity: "0",
        companyHandle: "c1",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
    let jobId;
    
    beforeAll(async function () {
      const result = await db.query("SELECT id FROM jobs WHERE title = 'j1'");
      jobId = result.rows[0].id;
    });
  
    test("works", async function () {
      let job = await Job.get(jobId);
      expect(job).toEqual({
        id: jobId,
        title: "j1",
        salary: 10000,
        equity: "0.1",
        companyHandle: "c1",
      });
    });
  
    test("not found if no such job", async function () {
      try {
        await Job.get(999);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });
  

/************************************** update */

describe("update", function () {
    let jobId;
  
    beforeAll(async function () {
      const result = await db.query("SELECT id FROM jobs WHERE title = 'j1'");
      jobId = result.rows[0].id;
    });
  
    const updateData = {
      title: "updated",
      salary: 40000,
      equity: "0.3",
    };
  
    test("works", async function () {
      let job = await Job.update(jobId, updateData);
      expect(job).toEqual({
        id: jobId,
        companyHandle: "c1",
        ...updateData,
      });
    });
  
    test("not found if no such job", async function () {
      try {
        await Job.update(999, updateData);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });

/************************************** remove */

describe("remove", function () {
    let jobId;
  
    beforeAll(async function () {
      const result = await db.query("SELECT id FROM jobs WHERE title = 'j1'");
      jobId = result.rows[0].id;
    });
  
    test("works", async function () {
      await Job.remove(jobId);
      const res = await db.query("SELECT * FROM jobs WHERE id=$1", [jobId]);
      expect(res.rows.length).toEqual(0);
    });
  
    test("not found if no such job", async function () {
      try {
        await Job.remove(999);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });
