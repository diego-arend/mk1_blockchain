import { jest } from "@jest/globals";
import Block from "../src/lib/block";
import Blockchain from "./../src/lib/blockchain";

jest.mock("../src/lib/block");

const dataGenesisBlock = {
  index: 0,
  previousHash: "",
  data: "genesis",
};

describe("Blockchain test", () => {
  test("Should be valid block genesis", () => {
    const block = new Blockchain();
    const hash = block.blocks.length;

    expect(hash).toEqual(1);
  });

  test("Should be valid blockchain(genesis)", () => {
    const blockchain = new Blockchain();
    const valid = blockchain.isValidChain();

    expect(valid.success).toEqual(true);
  });

  test("Should add block", () => {
    const blockchain = new Blockchain();
    const result = blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        data: "Block 2",
      } as Block)
    );

    expect(result.success).toEqual(true);
  });

  test("Should be valid blockchain(two blocks)", () => {
    const blockchain = new Blockchain();
    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        data: "Block 2",
      } as Block)
    );
    const valid = blockchain.isValidChain();

    expect(valid.success).toEqual(true);
  });

  test("Should NOT be valid add block", () => {
    const blockchain = new Blockchain();
    const block = new Block({
      index: -1,
      previousHash: blockchain.blocks[0].hash,
      data: "Block 2",
    } as Block);
    const result = blockchain.addBlock(block);

    expect(result.success).toEqual(false);
    expect(result.message).toEqual("Invalid Block:Invalid mock block data");
  });

  test("Should be NOT valid blockchain(adultered block)", () => {
    const blockchain = new Blockchain();
    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        data: "Block 2",
      } as Block)
    );
    blockchain.blocks[1].index = -1;
    const valid = blockchain.isValidChain();

    expect(valid.success).toEqual(false);
  });

  test("Should be valid hash getBlock(hash)", () => {
    const blockchain = new Blockchain();
    const hash = blockchain.blocks[0].hash;
    const block = blockchain.getBlock(hash);

    expect(block?.data).toEqual(dataGenesisBlock.data);
  });

  test("Should be NOT valid hash getBlock()", () => {
    const blockchain = new Blockchain();
    const block = blockchain.getBlock("abc");

    expect(block).toEqual(undefined);
  });

  test("Should be valid hash getBlock(index)", () => {
    const blockchain = new Blockchain();
    const block = blockchain.getBlock("0");

    expect(block?.data).toEqual(dataGenesisBlock.data);
  });

  test("Should NOT be valid hash getBlock(index)", () => {
    const blockchain = new Blockchain();
    const block = blockchain.getBlock("1");

    expect(block).toEqual(undefined);
  });
});
