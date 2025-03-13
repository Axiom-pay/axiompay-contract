import pkg from "hardhat";
const { ethers } = pkg;
import { generateOrRetriveKeys } from "../utils/paillier.mjs";
import { getContract, updateContract } from "../utils/storage.mjs";
import { Contract } from "ethers";
import { isValidAddress } from "@nomicfoundation/ethereumjs-util";
import abi from "../artifacts/contracts/pool/TwinTokenPool.sol/TwinTokenPool.json" assert { type: "json" };
import { config } from "dotenv";

class Step {
  __cnt = 0;
  __subCnt = 1;

  inc() {
    this.__cnt++;
    this.__subCnt = 1;
  }

  subInc() {
    this.__subCnt++;
  }

  step(msg) {
    this.inc();
    console.log(`step ${this.__cnt}. ${msg}`);
  }

  subStep(msg) {
    console.log(`step ${this.__cnt}.${this.__subCnt}. ${msg}`);
    this.subInc();
  }
}

const mintList = [
  // address of the token to mint
];

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  config();
  const step = new Step();

  const [deployer] = await ethers.getSigners();
  step.step("deploy the utils contract");
  const priv2priv = await deployOrRetrieveContract(
    "Priv2PrivVerifier",
    [],
    step
  );
  await sleep(1000);
  const priv2pub = await deployOrRetrieveContract("Priv2PubVerifier", [], step);
  await sleep(1000);
  const pub2priv = await deployOrRetrieveContract("Pub2PrivVerifier", [], step);
  await sleep(1000);
  const validator = await deployOrRetrieveContract(
    "Validator",
    [priv2priv, priv2pub, pub2priv],
    step
  );
  await sleep(500);

  step.step("deploy the TwinTokenPool contract");
  const twinTokenPool = await deployOrRetrieveContract(
    "TwinTokenPool",
    [deployer, validator],
    step
  );
  await sleep(500);

  let ERC20;
  if (!process.env.PLAINERC20) {
    ERC20 = await deployOrRetrieveContract(
      "MockERC20",
      ["MockUSDT", "mockUSDT", BigInt("100000000000000000000000"), mintList],
      step
    );
    await sleep(500);
  } else {
    ERC20 = process.env.PLAINERC20;
    if (!isValidAddress(ERC20)) {
      throw new Error(`invalid address syntax: ${ERC20}`);
    }
    // todo: check the address whether is an ERC20 contract, it is not quite as easy as thought
    updateContract("MockERC20", ERC20);
  }

  step.step(`register the AxiomPay service`);
  const crypto = generateOrRetriveKeys();
  if (!crypto) {
    throw new Error("retrieve paillierNN error");
  }
  let axiomPay = getContract("AxiomPay");
  let privateToken = getContract("PrivateToken");
  if (!axiomPay || !privateToken) {
    let twinTokenPoolContract = new Contract(twinTokenPool, abi.abi, deployer);
    await twinTokenPoolContract.once(
      "Register",
      async (originalERC20, privateERC20, axiomPay, paillierNN) => {
        console.log(
          `AxiomPay contract address: ${axiomPay}, PrivateToken address: ${privateERC20}`
        );
        updateContract("AxiomPay", axiomPay.toString());
        updateContract("PrivateToken", privateERC20.toString());
      }
    );
    await twinTokenPoolContract.register(ERC20, crypto.publicKey._n2);
    await sleep(10000);
    await twinTokenPoolContract.removeAllListeners();
  } else {
    console.log(
      `AxiomPay contract address: ${axiomPay}, privateERC20 address: ${privateToken}`
    );
  }
}

async function deployOrRetrieveContract(contractName, params, step) {
  step.subStep(`deploy the ${contractName}`);

  let contract = getContract(contractName);
  if (!contract) {
    contract = (
      await ethers.deployContract(contractName, params)
    ).target.toString();
    updateContract(contractName, contract);
  }
  console.log(`${contractName} contract address: ${contract}`);
  return contract;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
