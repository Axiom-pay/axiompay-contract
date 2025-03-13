import pkg from "hardhat";
const { ethers } = pkg;
import { expect } from "chai";
import { generateOrRetriveKeys } from "../utils/paillier.mjs";
import { generatePrivateAndPublicKey, elgamalEncrypt } from "babyjubjub-utils";

describe("Test PrivateToken", async () => {
    let users;
    let privateToken;
    let paillierPrivateKey;
    let erc20;
    let encryptKeys1;
    let encryptKeys2;

    beforeEach("prepare", async () => {
        users = await ethers.getSigners();
        const PrivateToken_Factory = await ethers.getContractFactory("PrivateToken");

        const MockERC20_Factory = await ethers.getContractFactory("MockERC20");
        erc20 = await MockERC20_Factory.deploy("mockUSDT", "mockUSDT", BigInt("1000000"), [users[0]]);

        paillierPrivateKey = generateOrRetriveKeys();
        const addressBook = await ethers.deployContract("AddressBook", [users[0].address]);
        privateToken = await PrivateToken_Factory.deploy(erc20.target, users[0], paillierPrivateKey.publicKey._n2, addressBook);

        encryptKeys1 = await generatePrivateAndPublicKey();
        encryptKeys2 = await generatePrivateAndPublicKey();
    });

    it(`Should revert account not exist`, async () => {
        let encrypted = await elgamalEncrypt(encryptKeys1.publicKey, 12345678);

        let c1 = [encrypted.C1.x.toString(), encrypted.C1.y.toString()];
        let c2 = [encrypted.C2.x.toString(), encrypted.C2.y.toString()];

        await expect(privateToken.privateTransferTo(users[1].address, c1, c2, 0n)).to.be.revertedWithCustomError(privateToken, "ErrAddressNotExist");
    });
})