import sha256 from "crypto-js/sha256";
import Validation from "./validation";

/**
 * Blocks class
 */
export default class Block {
  index: number;
  hash: string;
  previousHash: string;
  timestamp: number;
  data: string;

  /**
   * Create Block
   * @param block Block data
   */
  constructor(block?: Block) {
    this.index = block?.index || 0;
    this.timestamp = block?.timestamp || Date.now();
    this.previousHash = block?.previousHash || "";
    this.data = block?.data || "";
    this.hash = block?.hash || this.generateHash();
  }

  /**
   * @returns Block hash
   */
  generateHash(): string {
    return sha256(
      this.index + this.data + this.timestamp + this.previousHash
    ).toString();
  }

  /**
   * Define if data block is valid
   * @returns boolean
   */
  isValid(prevHash: string, previousIndex: number): Validation {
    if (previousIndex !== this.index - 1)
      return new Validation(false, "Invalid index");
    if (!this.data) return new Validation(false, "Invalid data");
    if (this.timestamp < 1) return new Validation(false, "Invalid timestamp");
    if (prevHash !== this.previousHash)
      return new Validation(false, "Invalid previous hash");
    if (this.hash !== this.generateHash())
      return new Validation(false, "Invalid hash");

    return new Validation();
  }
}
