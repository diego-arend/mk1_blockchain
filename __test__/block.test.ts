import Block from "../src/lib/block";

describe("Block test", () => {
  let genesisBlock: Block;

  beforeAll(() => {
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
    const valid = block.isValid(genesisBlock.hash, genesisBlock.index);

    expect(valid.success).toEqual(true);
  });

  test("Should NOT be valid(fallbacks)", () => {
    const block = new Block();
    const valid = block.isValid(genesisBlock.hash, genesisBlock.index);

    expect(valid.success).toEqual(false);
  });

  test("Should be NOT valid(index)", () => {
    const block = new Block({
      index: -1,
      previousHash: genesisBlock.hash,
      data: "block2",
    } as Block);
    const valid = block.isValid(genesisBlock.hash, genesisBlock.index);

    expect(valid.success).toEqual(false);
    expect(valid.message).toEqual("Invalid index");
  });

  test("Should be NOT valid(data)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesisBlock.hash,
      data: "",
    } as Block);
    const valid = block.isValid(genesisBlock.hash, genesisBlock.index);

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
    const valid = block.isValid(genesisBlock.hash, genesisBlock.index);

    expect(valid.success).toEqual(false);
    expect(valid.message).toEqual("Invalid timestamp");
  });

  test("Should be NOT valid(previousHash)", () => {
    const block = new Block({
      index: 1,
      previousHash: "kasjdk",
      data: "abc",
    } as Block);
    const valid = block.isValid(genesisBlock.hash, genesisBlock.index);

    expect(valid.success).toEqual(false);
    expect(valid.message).toEqual("Invalid previous hash");
  });

  test("Should be NOT valid(hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesisBlock.hash,
      data: "block2",
    } as Block);
    block.data = "invalid data block";
    const valid = block.isValid(genesisBlock.hash, genesisBlock.index);

    expect(valid.success).toEqual(false);
    expect(valid.message).toEqual("Invalid hash");
  });
});
