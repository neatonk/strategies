// @format
import { readFileSync } from "fs";

import logger from "../../logger.mjs";
import { parseJSON } from "../../utils.mjs";

export const name = "logs-to-subgraph";
const log = logger(name);
export const version = "0.1.0";

export function onClose() {
  log("closed");
  return {
    write: null,
    messages: [],
  };
}

export function onError(error) {
  log(error.toString());
  throw error;
}

let validatedContracts;

export function onLine(line, contracts) {
  let logs;
  try {
    logs = parseJSON(line, 100);
  } catch (err) {
    return {
      write: null,
      messages: [],
    };
  }

  logs = logs.map((log) => ({
    address: log.address,
    tokenId: `${BigInt(log.topics[3]).toString(10)}`,
    createdAtBlockNumber: `${parseInt(log.blockNumber, 16)}`,
    platform: contracts[log.address].name,
  }));

  let write;
  if (logs.length) {
    write = JSON.stringify(logs);
  }
  return {
    write,
    messages: [],
  };
}
