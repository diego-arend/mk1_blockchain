export default interface BlockInterface {
  index: number;
  previousHash: string;
  difficulty: number;
  maxDifficulty: number;
  feePerTx: number;
  data: string;
}
