import BlockInterface from "../interfaces/blockInterface";
import Block from "../lib/block";

require("dotenv").config();

const minerWallet = {
  privateKey: `${process.env.MINER_PRIVATE_KEY}`,
  publicKey: `${process.env.MINER_PUBLIC_KEY}`,
};

let totalMined = 0;

const RequestBlock = async (): Promise<BlockInterface> => {
  try {
    const url = `${process.env.URL_BLOCKCHAIN_SERVER}/blocks/next`;

    const response = await fetch(`${url}`, { method: "GET" });

    if (response.status === 200) {
      const data = await response.json();
      const blockInfo = data.data as BlockInterface;

      return blockInfo;
    } else {
      throw new Error("Request error blockchain for block info");
    }
  } catch (e) {
    console.log("debug error", (e as Error).message);
    if ((e as Error).message === "fetch failed") {
      throw new Error("Not connection blockchain");
    }
    throw new Error((e as Error).message);
  }
};

const SendNewBlockMined = async (
  payload: Block
): Promise<ReponseSendNewBlock> => {
  try {
    const url = `${process.env.URL_BLOCKCHAIN_SERVER}/blocks/`;
    const payloadStringfy = JSON.stringify(payload);
    const postContent = {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: payloadStringfy,
    };

    console.log("debug payload", postContent);

    const response = await fetch(`${url}`, postContent);

    if (response.status === 201) {
      const data = await response.json();
      return { message: "Sending block success!", data: data.data.hash };
    } else {
      throw new Error("Request error blockchain for block info");
    }
  } catch (e) {
    if ((e as Error).message === "fetch failed") {
      throw new Error("Not connection blockchain");
    }
    throw new Error((e as Error).message);
  }
};

/**
 * Mine new block
 */
async function miner() {
  // try {
  console.log("Getting next block info...");
  const requestBlock = await RequestBlock();

  console.log("Minning new block...");
  const newBlock = Block.fromBlockInfo(requestBlock);
  newBlock.mine(requestBlock.difficulty, minerWallet.publicKey);

  console.log("Sending block mined...", newBlock);
  const sendBlock = await SendNewBlockMined(newBlock);
  console.log("sendBlock", sendBlock);
  // } catch (e) {
  //   throw new Error(`${(e as Error).message}. Stop minning!`);
  // }

  // TODO verificar falha de request

  // Loop mine
  setTimeout(() => {
    miner();
  }, 1000);
}

miner();
