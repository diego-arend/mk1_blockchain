import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import Blockchain from "../lib/blockchain";
import Block from "../lib/block";

const PORT = 3000;

/**
 * Create an instance of the Express framework.
 */
const app = express();

/**
 * Register midlewares
 * - morgan: run in development and production environments
 */
app.use(express.json());
/* c8 ignore start */
// directive /* c8 ... */ disable lines for test coverage
if (process.argv.includes("--run")) {
  app.use(morgan("tiny"));
}
/* c8 ignore stop */

/**
 * Intialize instance of Blockchain
 */
const blockchain = new Blockchain();

/**
 * Routes
 */
app.get("/status", (_req: Request, res: Response, _next: NextFunction) => {
  res.json({
    numberOfBlocks: blockchain.blocks.length,
    isValid: blockchain.isValidChain(),
    lastBlock: blockchain.getLastBlock(),
  });
});

app.get("/blocks/next", (req: Request, res: Response, _next: NextFunction) => {
  res.json({ data: blockchain.getNextblock() });
});

app.get(
  "/blocks/:indexOrHash",
  (req: Request, res: Response, _next: NextFunction) => {
    const block = blockchain.getBlock(req.params.indexOrHash);

    if (!block) {
      res.sendStatus(404);
      return;
    }

    res.json({ data: block });
  }
);

app.post("/blocks", (req: Request, res: Response, _next: NextFunction) => {
  if (req.body.hash === undefined) {
    res.sendStatus(422);
    return;
  }

  const block = new Block(req.body as Block);
  const validation = blockchain.addBlock(block);

  if (!validation.success) {
    res.status(400).json(validation);
    return;
  }

  res.status(201).json({ data: block });
});

/**
 * Server startup message
 * listen run in development and production environments
 */
/* c8 ignore start */
// directive /* c8 .. */ disable lines for test coverage
if (process.argv.includes("--run")) {
  app.listen(PORT, () => {
    console.log(`Blockchain Server is running at ${PORT}`);
  });
}
/* c8 ignore stop */

export { app };
