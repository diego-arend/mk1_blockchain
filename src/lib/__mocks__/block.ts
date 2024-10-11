import Validation from "../validation";

/**
 * Mocked Blocks class
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
   * Create mock Block
   * @param block mock Block data
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
   * @returns mock Block hash
   */
  generateHash(): string {
    return this.hash || "abcdef";
  }

  /**
   * Define if data mock block is valid
   * @returns boolean
   */
  isValid(prevHash: string, previousIndex: number, difficulty: number): Validation {
    if (!prevHash || previousIndex < 0 || this.index < 0 || difficulty < 0) {
      return {
        success: false,
        message: "Invalid mock block data",
      };
    }

    return new Validation();
  }
}
