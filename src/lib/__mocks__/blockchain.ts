import Block from "./block";
import Validation from "../validation";

/**
 * Generate mocked Blockchain
 */
export default class Blockchain {
  blocks: Block[];
  nextIndex: number = 0;

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
}