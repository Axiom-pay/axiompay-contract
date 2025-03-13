import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
import { generateOrRetriveKeys } from "../utils/paillier.mjs";
import { generatePrivateAndPublicKey, packPoint } from "babyjubjub-utils";

describe("Test TwinTokenPool", function () {
  let owner;
  let user1;
  let twinTokenPool;
  let mockUSDT;
  let mockUSDT1;
  let privateKey;

  async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  beforeEach("prepare", async () => {
    [owner, user1] = await ethers.getSigners();
    const priv2PrivVerifier = await ethers.deployContract("Priv2PrivVerifier");
    const priv2PubVerifier = await ethers.deployContract("Priv2PubVerifier");
    const pub2PrivVerifier = await ethers.deployContract("Pub2PrivVerifier");
    const validatorFactory = await ethers.getContractFactory("Validator");
    const validator = await validatorFactory.deploy(priv2PrivVerifier, priv2PubVerifier, pub2PrivVerifier);
    const twinTokenPoolFactory = await ethers.getContractFactory("TwinTokenPool");
    twinTokenPool = await twinTokenPoolFactory.deploy(owner, validator);
    mockUSDT = await ethers.deployContract("MockERC20", ["MockUSDT", "mockUSDT", BigInt("10000000000000000000"), [owner]]);
    mockUSDT1 = await ethers.deployContract("MockERC20", ["MockUSDT", "mockUSDT", BigInt("10000000000000000000"), [owner]]);
    privateKey = generateOrRetriveKeys();
  });

  it("Should has different contract Address with different ERC20", async function () {
    const event = twinTokenPool.getEvent("Register");
    await twinTokenPool.addListener(event, async (originalERC20, privateERC20, axiomPay, paillierNN) => {
      console.log(`privateERC20 deployed to: ${privateERC20}, axiomPay deployed to: ${axiomPay}`);
      expect(paillierNN).to.be.equals(privateKey.publicKey._n2);
    });
    await (await twinTokenPool.register(mockUSDT, privateKey.publicKey._n2)).wait();
    await (await twinTokenPool.register(mockUSDT1, privateKey.publicKey._n2)).wait();
    await sleep(1000);
    twinTokenPool.removeAllListeners();
  });

  it("Should revert if register a contract twice", async () => {
    await twinTokenPool.register(mockUSDT, privateKey.publicKey._n2);
    await expect(twinTokenPool.register(mockUSDT, privateKey.publicKey._n2)).to.be.reverted;
  })

  it("Should register correct", async function () {
    const event = twinTokenPool.getEvent("Register");
    await twinTokenPool.on(event, async (originalERC20, privateERC20, axiomPay, paillierNN) => {
      expect(originalERC20).to.be.equals(await mockUSDT.getAddress());
      expect(paillierNN).to.be.equals(privateKey.publicKey._n2);
      console.log(`privateERC20 deployed to: ${privateERC20}, axiomPay deployed to: ${axiomPay}`);
    });
    await (await twinTokenPool.register(mockUSDT, privateKey.publicKey._n2)).wait();
    twinTokenPool.removeAllListeners();
  });

  it("Only owner can register", async function () {
    await expect(twinTokenPool.connect(user1).register(mockUSDT, privateKey.publicKey._n2)).to.be.revertedWithCustomError(twinTokenPool, `OwnableUnauthorizedAccount`);
  });

  it("Non-ERC20 contract cannot be registered", async function () {
    await expect(twinTokenPool.register(owner, privateKey.publicKey._n2)).to.be.reverted;
  });

  it("Should get the original ERC20 lists", async () => {
    await (await twinTokenPool.register(mockUSDT, privateKey.publicKey._n2)).wait();
    await (await twinTokenPool.register(mockUSDT1, privateKey.publicKey._n2)).wait();
    const lists = await twinTokenPool.showLists();
    expect(lists.length).to.be.equals(2);
    expect(lists[0].originalERC20Name).to.be.equals(await mockUSDT.name());
    expect(lists[1].originalERC20Name).to.be.equals(await mockUSDT1.name());
  });

  it("Should get the user account property correct", async () => {
    // get the account property(is private or not)
    let isPrivate = await twinTokenPool.isPrivate(owner);
    expect(isPrivate).false;
    // register an account to be private
    let keys = await generatePrivateAndPublicKey();
    const publicKey = (await packPoint(keys.publicKey)).toString(16);
    await twinTokenPool.registerAccount(owner, publicKey);
    // check the account property again
    isPrivate = await twinTokenPool.isPrivate(owner);
    expect(isPrivate).true;
  });

  it("Should get the token lists", async () => {
    // at first, non ERC20 has been registered, the list is empty
    let lists = await twinTokenPool.showLists();
    expect(lists).to.empty;

    // register an ERC20
    const tokenLists = [mockUSDT];
    for (let index = 0; index < tokenLists.length; index++) {
      const element = tokenLists[index];
      await (await twinTokenPool.register(element, privateKey.publicKey._n2)).wait();
    }
    // now should get the correct information
    lists = await twinTokenPool.showLists();
    expect(lists.length).to.be.equals(tokenLists.length);
    for (let i = 0; i < lists.length; i++) {
      expect(lists[i].originalERC20Name).to.be.equals(await mockUSDT.name());
      expect(lists[i].privateERC20Name).to.be.equals("pr" + await mockUSDT1.name());

      let axiomPayContract = await ethers.getContractAt("AxiomPay", lists[i].axiomPay);
      // Should get correct plain balance
      let plainBalance = await axiomPayContract.balanceOf(owner);
      expect(plainBalance).to.be.equals(BigInt("10000000000000000000"));
      // Should get correct private balance
      let privateBalance = await axiomPayContract.privateBalanceOf(owner);
      expect(privateBalance.c1).to.deep.equals([0n, 0n]);
      expect(privateBalance.c2).to.deep.equals([0n, 0n]);
    }
  });
});
