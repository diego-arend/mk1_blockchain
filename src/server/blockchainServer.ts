import express from "express";
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
 */
app.use(morgan("tiny"));
app.use(express.json());

/**
 * Intialize instance of Blockchain
 */
const blockchain = new Blockchain();

/**
 * Routes
 */
app.get("/status", (_req, res, _next) => {
  res.json({
    numberOfBlocks: blockchain.blocks.length,
    isValid: blockchain.isValidChain(),
    lastBlock: blockchain.getLastBlock(),
  });
});

app.get("/blocks/:indexOrHash", (req, res, _next) => {
  const block = blockchain.getBlock(req.params.indexOrHash);

  if (!block) {
    res.sendStatus(404);
    return;
  }

  res.json({ data: block });
});

app.post("/blocks", (req, res, _next) => {
  if (req.body.hash !== undefined) {
    res.sendStatus(422);
    return;
  }

  const block = new Block(req.body as Block);
  const validation = blockchain.addBlock(block);

  if (!validation.success) {
    res.status(400).json(validation);
    return;
  }

  res.status(200).json({ data: block });
});

/**
 * Server startup message
 */
app.listen(PORT, () => {
  console.log(`Blockchain Server is running at ${PORT}`);
});
