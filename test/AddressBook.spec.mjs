import pkg from "hardhat";
const { ethers } = pkg;
import { expect } from "chai";
import { generatePrivateAndPublicKey, getBabyJub, packPoint, privateToPublicKey, unpackPoint } from "babyjubjub-utils";

describe("Test AddressBook", async () => {
    let addressBook;
    let users;
    let publicKey;
    let privateKey;

    before("prepare", async () => {
        users = await ethers.getSigners();
        const AddressBook_Factory = await ethers.getContractFactory("AddressBook");
        addressBook = await AddressBook_Factory.deploy(users[0].address);
        const keyPairs = await generatePrivateAndPublicKey();
        publicKey = (await packPoint(keyPairs.publicKey)).toString(16);
        privateKey = keyPairs.privateKey;
    });

    it("Should register a public account and retrieve correct", async () => {
        let property = await addressBook.isPrivate(users[0]);
        expect(property).false;
        await addressBook.registerAccount(users[0], publicKey);
        let publicKeyGet = await unpackPoint(BigInt("0x" + await addressBook.getUserPublicKey(users[0].address)));
        let publicKeyGetPoint = await privateToPublicKey(privateKey);
        expect(publicKeyGetPoint).to.be.deep.equals(publicKeyGet);

        property = await addressBook.isPrivate(users[0]);
        expect(property).true;
    });

    it("random address should be a public account", async () => {
        const property = await addressBook.isPrivate(users[2]);
        expect(property).false;
    });

    it("after swap one user property, other address should not be influenced", async () => {
        await addressBook.registerAccount(users[0], publicKey);
        let property = await addressBook.isPrivate(users[0]);
        expect(property).true;

        property = await addressBook.isPrivate(users[1]);
        expect(property).false;
    });
})