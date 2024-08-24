"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");
const Job = require("../models/job");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  adminToken,
  u1Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
    const newJob = {
      title: "new",
      salary: 100,
      equity: "0.1",
      companyHandle: "c1",
    };
  
    test("ok for admins", async function () {
      const resp = await request(app)
          .post("/jobs")
          .send(newJob)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({
        job: {
          id: expect.any(Number),
          title: "new",
          salary: 100,
          equity: "0.1",
          companyHandle: "c1",
        },
      });
    });
  
    test("unauth for non-admin users", async function () {
      const resp = await request(app)
          .post("/jobs")
          .send(newJob)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(403);
    });
  
    test("bad request if missing data", async function () {
      const resp = await request(app)
          .post("/jobs")
          .send({
            title: "new",
          })
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(400);
    });
  
    test("bad request if invalid data", async function () {
      const resp = await request(app)
          .post("/jobs")
          .send({
            ...newJob,
            salary: "not-a-number",
          })
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(400);
    });
  });
  
  /************************************** GET /jobs */
  
  describe("GET /jobs", function () {
    test("ok for anon", async function () {
      const resp = await request(app).get("/jobs");
      expect(resp.body).toEqual({
        jobs: [
          {
            id: 1,
            title: "Job1",
            salary: 50000,
            equity: "0.05",
            companyHandle: "c1",
          },
          {
            id: 2,
            title: "Job2",
            salary: 60000,
            equity: "0.07",
            companyHandle: "c2",
          },
          {
            id: 3,
            title: "Job3",
            salary: 70000,
            equity: "0.1",
            companyHandle: "c3",
          },
        ],
      });
    });
  });

  describe("GET /jobs", function () {
    test("works with all filters", async function () {
      const resp = await request(app)
          .get("/jobs")
          .query({ title: "J", minSalary: 60000, hasEquity: true });
      expect(resp.body).toEqual({
        jobs: [
          {
            id: expect.any(Number),
            title: "Job2",
            salary: 60000,
            equity: "0.07",
            companyHandle: "c2",
          },
          {
            id: expect.any(Number),
            title: "Job3",
            salary: 70000,
            equity: "0.1",
            companyHandle: "c3",
          },
        ],
      });
    });
  
    test("works with some filters", async function () {
      const resp = await request(app)
          .get("/jobs")
          .query({ minSalary: 70000 });
      expect(resp.body).toEqual({
        jobs: [
          {
            id: expect.any(Number),
            title: "Job3",
            salary: 70000,
            equity: "0.1",
            companyHandle: "c3",
          },
        ],
      });
    });
  
    test("works without filters", async function () {
      const resp = await request(app).get("/jobs");
      expect(resp.body).toEqual({
        jobs: [
          {
            id: expect.any(Number),
            title: "Job1",
            salary: 50000,
            equity: "0.05",
            companyHandle: "c1",
          },
          {
            id: expect.any(Number),
            title: "Job2",
            salary: 60000,
            equity: "0.07",
            companyHandle: "c2",
          },
          {
            id: expect.any(Number),
            title: "Job3",
            salary: 70000,
            equity: "0.1",
            companyHandle: "c3",
          },
        ],
      });
    });
  });
  
  /************************************** GET /jobs/:id */
  
  describe("GET /jobs/:id", function () {
    test("works for anon", async function () {
      const resp = await request(app).get(`/jobs/1`);
      expect(resp.body).toEqual({
        job: {
          id: 1,
          title: "Job1",
          salary: 50000,
          equity: "0.05",
          companyHandle: "c1",
        },
      });
    });
  
    test("not found for no such job", async function () {
      const resp = await request(app).get(`/jobs/999`);
      expect(resp.statusCode).toEqual(404);
    });
  });
  
  /************************************** PATCH /jobs/:id */
  
  describe("PATCH /jobs/:id", function () {
    test("works for admins", async function () {
      const resp = await request(app)
          .patch(`/jobs/1`)
          .send({
            title: "j1-updated",
          })
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual({
        job: {
          id: 1,
          title: "j1-updated",
          salary: 50000,
          equity: "0.05",
          companyHandle: "c1",
        },
      });
    });
  
    test("unauth for non-admin users", async function () {
      const resp = await request(app)
          .patch(`/jobs/1`)
          .send({
            title: "j1-updated",
          })
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(403);
    });
  
    test("not found on no such job", async function () {
      const resp = await request(app)
          .patch(`/jobs/999`)
          .send({
            title: "new-title",
          })
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(404);
    });
  
    test("bad request if invalid data", async function () {
      const resp = await request(app)
          .patch(`/jobs/1`)
          .send({
            salary: "not-a-number",
          })
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(400);
    });
  });
  
  /************************************** DELETE /jobs/:id */
  
  describe("DELETE /jobs/:id", function () {
    test("works for admins", async function () {
      const resp = await request(app)
          .delete(`/jobs/1`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual({ deleted: "1" });
    });
  
    test("unauth for non-admin users", async function () {
      const resp = await request(app)
          .delete(`/jobs/1`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(403);
    });
  
    test("not found for no such job", async function () {
      const resp = await request(app)
          .delete(`/jobs/999`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(404);
    });
  });
