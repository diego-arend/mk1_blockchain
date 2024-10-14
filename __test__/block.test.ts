import Block from "../src/lib/block";

describe("Block test", () => {
  let genesisBlock: Block;
  const exampleDifficulty = 0;
  const exampleMinerWallet = "hasglah";

  beforeAll(() => {
    // mock new Date() return fixed date
    jest.useFakeTimers().setSystemTime(new Date(2020, 9, 1, 7));

    genesisBlock = new Block({
      index: 0,
      previousHash: "",
      data: "genesis",
    } as Block);
  });

  test("Should be valid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesisBlock.hash,
      data: "block2",
    } as Block);
    block.mine(exampleDifficulty, exampleMinerWallet);
    const valid = block.isValid(
      genesisBlock.hash,
      genesisBlock.index,
      exampleDifficulty
    );

    expect(valid.success).toEqual(true);
  });

  test("Should NOT be valid(fallbacks)", () => {
    const block = new Block();
    const valid = block.isValid(
      genesisBlock.hash,
      genesisBlock.index,
      exampleDifficulty
    );

    expect(valid.success).toEqual(false);
  });

  test("Should be NOT valid(index)", () => {
    const block = new Block({
      index: -1,
      previousHash: genesisBlock.hash,
      data: "block2",
    } as Block);
    const valid = block.isValid(
      genesisBlock.hash,
      genesisBlock.index,
      exampleDifficulty
    );

    expect(valid.success).toEqual(false);
    expect(valid.message).toEqual("Invalid index");
  });

  test("Should be NOT valid(data)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesisBlock.hash,
      data: "",
    } as Block);
    const valid = block.isValid(
      genesisBlock.hash,
      genesisBlock.index,
      exampleDifficulty
    );

    expect(valid.success).toEqual(false);
    expect(valid.message).toEqual("Invalid data");
  });

  test("Should be NOT valid(timestamp)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesisBlock.hash,
      data: "block2",
    } as Block);
    block.timestamp = -1;
    const valid = block.isValid(
      genesisBlock.hash,
      genesisBlock.index,
      exampleDifficulty
    );

    expect(valid.success).toEqual(false);
    expect(valid.message).toEqual("Invalid timestamp");
  });

  test("Should be NOT valid(previousHash)", () => {
    const block = new Block({
      index: 1,
      previousHash: "kasjdk",
      data: "abc",
    } as Block);
    const valid = block.isValid(
      genesisBlock.hash,
      genesisBlock.index,
      exampleDifficulty
    );

    expect(valid.success).toEqual(false);
    expect(valid.message).toEqual("Invalid previous hash");
  });

  test("Should be NOT valid(hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesisBlock.hash,
      data: "block2",
    } as Block);
    block.mine(exampleDifficulty, exampleMinerWallet);
    block.data = "invalid data block";
    const valid = block.isValid(
      genesisBlock.hash,
      genesisBlock.index,
      exampleDifficulty
    );

    expect(valid.success).toEqual(false);
    expect(valid.message).toEqual("Invalid hash");
  });

  test("Should be NOT valid(mine data)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesisBlock.hash,
      data: "block2",
    } as Block);
    const valid = block.isValid(genesisBlock.hash, genesisBlock.index, -1);

    expect(valid.success).toEqual(false);
    expect(valid.message).toEqual("No mined.");
  });

  test("Should create from block info", () => {
    const block = Block.fromBlockInfo({
      index: 1,
      previousHash: genesisBlock.hash,
      difficulty: exampleDifficulty,
      maxDifficulty: 62,
      feePerTx: 1,
      data: "block test 2",
    });
    block.mine(exampleDifficulty, exampleMinerWallet);
    const valid = block.isValid(
      genesisBlock.hash,
      genesisBlock.index,
      exampleDifficulty
    );

    expect(valid.success).toEqual(true);
  });
});
