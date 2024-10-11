import { jest } from "@jest/globals";
import request from "supertest";
import { app } from "../src/server/blockchainServer";
import Block from "../src/lib/block";

jest.mock("../src/lib/block");
jest.mock("../src/lib/blockchain");

describe("Blockchain Server tests", () => {
  test("GET /status", async () => {
    const response = await request(app).get("/status");

    expect(response.status).toBe(200);
    expect(response.body.isValid.success).toEqual(true);
  });

  test("GET /blocks/indexOrHash - valid index", async () => {
    const response = await request(app).get("/blocks/0");

    expect(response.status).toBe(200);
    expect(response.body.data.index).toEqual(0);
  });

  test("GET /blocks/indexOrHash - valid hash", async () => {
    const response = await request(app).get("/blocks/abcdef");

    expect(response.status).toBe(200);
    expect(response.body.data.index).toEqual(0);
  });

  test("GET /blocks/indexOrHash - NOT valid hash - response 404", async () => {
    const response = await request(app).get("/blocks/abc");

    expect(response.status).toBe(404);
  });

  test("POST /blocks - Should be add block", async () => {
    const block = new Block({ index: 1 } as Block);
    const response = await request(app).post("/blocks").send(block);

    expect(response.status).toBe(201);
    expect(response.body.data.index).toEqual(1);
  });

  test("POST /blocks - Should NOT be add block - response 422", async () => {
    const response = await request(app).post("/blocks").send({});

    expect(response.status).toBe(422);
  });

  test("POST /blocks - Should NOT be add block - response 400", async () => {
    const block = new Block({ index: -1 } as Block);
    const response = await request(app).post("/blocks").send(block);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Invalid mock Block.");
  });
});
