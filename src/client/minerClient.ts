require("dotenv").config();
import axios from "axios";
import BlockInterface from "../typing/blockInterface";
import Block from "../lib/block";
import AgentKeepAlive, { HttpsAgent } from "agentkeepalive";

/**
 * Configuration required to avoid error: "socket hang up" in a local environment.
 */
axios.defaults.httpAgent = new AgentKeepAlive({ keepAlive: false });

/**
 * Miner data
 */
const minerWallet = {
  privateKey: `${process.env.MINER_PRIVATE_KEY}`,
  publicKey: `${process.env.MINER_PUBLIC_KEY}`,
};

const RequestBlock = async (): Promise<BlockInterface | String> => {
  try {
    const url = `${process.env.URL_BLOCKCHAIN_SERVER}/blocks/next`;

    const response = await axios.get(`${url}`);

    if (response.status === 200) {
      const data = await response.data;
      const blockInfo = data.data as BlockInterface;

      return blockInfo;
    } else {
      return `Request error blockchain for block info:${response}`;
    }
  } catch (e) {
    return `Request error blockchain for block info`;
  }
};

const SendNewBlockMined = async (
  payload: Block
): Promise<ReponseSendNewBlock | String> => {
  try {
    const url = `${process.env.URL_BLOCKCHAIN_SERVER}/blocks/`;

    const response = await axios.post(url, payload);

    if (response.status === 201) {
      const data = await response.data;
      return { message: "Sending block success!", data: data.data.hash };
    } else {
      return `Invalid block mine:${response}`;
    }
  } catch (e) {
    return `Invalid block mine`;
  }
};

/**
 * Mine new block
 */
async function miner() {
  console.log("Getting next block info...");
  const requestBlock = await RequestBlock();

  if (requestBlock instanceof String) {
    console.log("Invalid mined block", requestBlock);
  } else {
    console.log("Minning new block...");
    const newBlock = Block.fromBlockInfo(requestBlock);
    newBlock.mine(requestBlock.difficulty, minerWallet.publicKey);

    console.log("Sending block mined...", newBlock);
    const sendBlock = await SendNewBlockMined(newBlock);
    console.log("sendBlock", sendBlock);
  }

  // Loop mine
  setTimeout(() => {
    miner();
  }, 1000);
}

miner();
