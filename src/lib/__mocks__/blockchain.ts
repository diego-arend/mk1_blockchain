import Block from "./block";
import Validation from "../validation";
import BlockInterface from "../../typing/blockInterface";

/**
 * Generate mocked Blockchain
 */
export default class Blockchain {
  blocks: Block[];
  nextIndex: number = 0;
  static readonly difficultyFactor = 5;
  static readonly maxDifficulty = 62;

  /**
   * Create Genesis mocked Block
   */
  constructor() {
    this.blocks = [
      new Block({
        index: 0,
        hash: "abcdef",
        previousHash: "",
        data: "genesis",
        timestamp: Date.now(),
      } as Block),
    ];
    this.nextIndex++;
  }

  /**
   * Get last Block on chain
   * @returns Block
   */
  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  /**
   * Calculate the current mining difficulty of the block chain.
   * The current difficulty based on the number of blocks / static difficulty factor
   * @returns Actual difficulty
   */
  getDifficulty(): number {
    return Math.ceil(this.blocks.length / Blockchain.difficultyFactor);
  }

  /**
   *
   * @param block Data mock block for add
   * @returns If success return object Validation with succes: true. If error return object validation with error message
   */
  addBlock(block: Block): Validation {
    if (block.index < 0) {
      return new Validation(false, "Invalid mock Block.");
    }

    this.blocks.push(block);
    this.nextIndex++;

    return new Validation();
  }

  /**
   * Verify with all hashs in chain are valid
   * @returns If chain is corrupted, return `Invalid Block:${validation.message}`
   */
  isValidChain(): Validation {
    return new Validation();
  }

  /**
   * Get specific block by hash
   * @param hash Block hash
   * @returns Block | undefined
   */
  getBlock(indexOrHash: string): Block | undefined {
    let find: Block | undefined;

    const findIndex = () => {
      find = this.blocks[parseInt(indexOrHash)];

      if (!find) {
        return undefined;
      }

      return find;
    };

    const findHash = () => {
      find = this.blocks.find((b) => b.hash === indexOrHash);

      if (!find) {
        return undefined;
      }

      return find;
    };

    if (/^[0-9]+$/.test(indexOrHash)) {
      return findIndex();
    } else {
      return findHash();
    }
  }

  /**
   * "Return transaction fee"
   * @returns value
   */
  getFeePerTx(): number {
    return 1;
  }

  /**
   * Get next block info
   * @returns Block
   */
  getNextblock(): BlockInterface {
    return {
      data: new Date().toString(),
      difficulty: 0,
      previousHash: this.getLastBlock().hash,
      index: 1,
      feePerTx: this.getFeePerTx(),
      maxDifficulty: Blockchain.maxDifficulty,
    } as BlockInterface;
  }
}
