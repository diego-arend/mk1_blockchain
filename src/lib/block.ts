import sha256 from "crypto-js/sha256";
import Validation from "./validation";
import BlockInterface from "../interfaces/blockInterface";

/**
 * Blocks class
 */
export default class Block {
  index: number;
  hash: string;
  previousHash: string;
  timestamp: number;
  data: string;
  nonce: number;
  miner: string;

  /**
   * Create Block
   * @param block Block data
   */
  constructor(block?: Block) {
    this.index = block?.index || 0;
    this.timestamp = block?.timestamp || Date.now();
    this.previousHash = block?.previousHash || "";
    this.data = block?.data || "";
    this.nonce = block?.nonce || 0;
    this.miner = block?.miner || "";
    this.hash = block?.hash || this.generateHash();
  }

  /**
   * @returns Block hash
   */
  generateHash(): string {
    return sha256(
      this.index +
        this.data +
        this.timestamp +
        this.previousHash +
        this.nonce +
        this.miner
    ).toString();
  }

  /**
   * Generates a new valid hash block with the specified difficulty, using a nonce with a given difficulty level
   * Method responsible for finding a valid block hash through trial and error (proof of work)
   * @param dificulty Number represent miner difficulty
   * @param miner The miner address
   *
   */
  mine(dificulty: number, miner: string) {
    this.miner = miner;
    const prefix = new Array(dificulty + 1).join("0");

    do {
      this.nonce = this.nonce + 1;
      this.hash = this.generateHash();
    } while (!this.hash.startsWith(prefix));
  }

  /**
   * Validate data block
   * @param difficulty Number represent miner difficulty
   * @param prevHash Hash of previous valid block
   * @param previousIndex Index of previous valid block
   * @returns boolean True if valid block
   */
  isValid(
    prevHash: string,
    previousIndex: number,
    difficulty: number
  ): Validation {
    if (previousIndex !== this.index - 1)
      return new Validation(false, "Invalid index");
    if (!this.data) return new Validation(false, "Invalid data");
    if (this.timestamp < 1) return new Validation(false, "Invalid timestamp");
    if (prevHash !== this.previousHash)
      return new Validation(false, "Invalid previous hash");

    if (this.nonce < 0 || !this.miner)
      return new Validation(false, "No mined.");

    // Verify number of left zeros for dificulty.
    // Bigger nonce, more zeros to the left, but higher difficult!
    const prefix = new Array(difficulty + 1).join("0");

    if (this.hash !== this.generateHash() || !this.hash.startsWith(prefix))
      return new Validation(false, "Invalid hash");

    return new Validation();
  }

  static fromBlockInfo(blockInfo: BlockInterface): Block {
    const block = new Block();
    block.index = blockInfo.index;
    block.previousHash = blockInfo.previousHash;
    block.data = blockInfo.data;

    return block;
  }
}
