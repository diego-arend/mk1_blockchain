import Block from "./block";
import Validation from "./validation";

/**
 * Generate Blockchain
 */
export default class Blockchain {
  blocks: Block[];
  nextIndex: number = 0;

  /**
   * Create Genesis Block
   */
  constructor() {
    this.blocks = [
      new Block({
        index: this.nextIndex,
        previousHash: "",
        data: "genesis",
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
   * @param block Data block for add
   * @returns If success return object Validation with succes: true. If error return object validation with error message
   */
  addBlock(block: Block): Validation {
    const lastBlock = this.getLastBlock();
    const validation = block.isValid(lastBlock.hash, lastBlock.index);

    if (!validation.success)
      return new Validation(false, `Invalid Block:${validation.message}`);

    this.blocks.push(block);
    this.nextIndex++;

    return new Validation();
  }

  /**
   * Verify with all hashs in chain are valid
   * @returns If chain is corrupted, return `Invalid Block:${validation.message}`
   */
  isValidChain(): Validation {
    for (let i = this.blocks.length - 1; i > 0; i--) {
      const currentBlock = this.blocks[i];
      const previousBlock = this.blocks[i - 1];
      const validation = currentBlock.isValid(
        previousBlock.hash,
        previousBlock.index
      );

      if (!validation.success)
        return new Validation(
          false,
          `Invalid Block #${currentBlock.index}:${validation.message}`
        );
    }

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
