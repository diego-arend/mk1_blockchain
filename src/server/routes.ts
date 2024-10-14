import express, { NextFunction, Request, Response, Router } from "express";
import Blockchain from "../lib/blockchain";
import Block from "../lib/block";

/**
 * Initialize blockchainRouter module
 */
const blockchainRouter: Router = express.Router();

/**
 * Initialize instance of Blockchain
 */
const blockchain = new Blockchain();

/**
 * Routes
 */
blockchainRouter.get(
  "/status",
  (_req: Request, res: Response, _next: NextFunction) => {
    res.json({
      numberOfBlocks: blockchain.blocks.length,
      isValid: blockchain.isValidChain(),
      lastBlock: blockchain.getLastBlock(),
    });
  }
);

blockchainRouter.post(
  "/blocks",
  (req: Request, res: Response, next: NextFunction) => {
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
  }
);

blockchainRouter.get(
  "/blocks/next",
  (req: Request, res: Response, _next: NextFunction) => {
    res.json({ data: blockchain.getNextblock() });
  }
);

blockchainRouter.get(
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

export default blockchainRouter;
