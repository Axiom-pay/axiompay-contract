import pkg from "hardhat";
const { ethers, GetGas } = pkg;
import { expect } from "chai";
import { generateOrRetriveKeys } from "../utils/paillier.mjs";
import { decryptFromChainRes, viewFromChainRes, encodeToPoint } from "./helper.mjs";
import { randomInt } from 'crypto';
import { generateProof, generateWitness, generateGroth16SolidityCallData, genPriv2PrivInput, genPriv2PubInput, genPub2PrivInput } from "../utils/circuit.mjs";
import fs from 'fs';
import { elgamalEncrypt, generatePrivateAndPublicKey, getBabyJub, packPoint, } from "babyjubjub-utils";

describe("Test AxiomPay", async function () {
    let users;
    let axiomPay;
    let paillierPrivateKey;
    let mockERC20;
    let twinToken;
    let keys1;
    let keys2;

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    before("prepare", async function () {
        users = await ethers.getSigners();
        const priv2PrivVerifier = await ethers.deployContract("Priv2PrivVerifier");
        const priv2PubVerifier = await ethers.deployContract("Priv2PubVerifier");
        const pub2PrivVerifier = await ethers.deployContract("Pub2PrivVerifier");
        const validatorFactory = await ethers.getContractFactory("Validator");
        const validator = await validatorFactory.deploy(priv2PrivVerifier, priv2PubVerifier, pub2PrivVerifier);
        mockERC20 = await ethers.deployContract("MockERC20", ["MockUSDT", "mockUSDT", BigInt("10000000000000000000"), [users[0]]]);
        twinToken = await ethers.deployContract("TwinTokenPool", [users[0], validator]);
        await twinToken.on(twinToken.getEvent("Register"), async (originalERC20, privateERC20, axiomPayAddress, paillierNN) => {
            axiomPay = await ethers.getContractAt("AxiomPay", axiomPayAddress);
            console.log("axiomPay deployed to: ", axiomPayAddress);
        });
        paillierPrivateKey = generateOrRetriveKeys();
        await (await twinToken.register(mockERC20, paillierPrivateKey.publicKey._n2)).wait();

        keys1 = await generatePrivateAndPublicKey();
        keys2 = await generatePrivateAndPublicKey();
    });

    it("Should get meta data", async () => {
        await sleep(100);
        const des = await axiomPay.description();
        expect(des).equals("MockUSDT AxiomPay Service");
    });

    it("Should get correct plain balance", async () => {
        const balance = await axiomPay.balanceOf(users[0]);
        expect(balance).equals(BigInt("10000000000000000000"));
    });

    it("Should get correct private balance if the account not exists", async () => {
        const balance = await axiomPay.privateBalanceOf(users[0]);
        expect(balance.c1).to.deep.equals([0n, 0n]);
        expect(balance.c2).to.deep.equals([0n, 0n]);
    });

    it("Should revert ErrDecimalTruncate", async () => {
        let publicKey = (await packPoint(keys1.publicKey)).toString(16);
        await twinToken.registerAccount(users[1].address, publicKey);

        const MAX_SIZE = 40;
        const MAX_K_SIZE = 1 << MAX_SIZE - 2;
        const modifiedEncrypt = async (msg, publicKey, max_k_size = MAX_K_SIZE, fromDecimal = 18n, toDecimal = 2n) => {
            msg = msg / (10n ** (fromDecimal - toDecimal));
            let babyJub = await getBabyJub();
            let encoded = babyJub.mulPointEscalar(babyJub.Base8, msg);
            let k = BigInt(randomInt(max_k_size));
            let lhs = babyJub.mulPointEscalar(publicKey, k);
            const c1 = babyJub.mulPointEscalar(babyJub.Base8, k);
            const c2 = babyJub.addPoint(encoded, lhs);
            return {
                c1: {
                    x: babyJub.F.toObject(c1[0]),
                    y: babyJub.F.toObject(c1[1])
                }, c2: {
                    x: babyJub.F.toObject(c2[0]),
                    y: babyJub.F.toObject(c2[1])
                }, k: k
            }
        }

        const value = 1000000000000000001n;
        let encrypted = await modifiedEncrypt(value, keys1.publicKey);

        let c1 = [encrypted.c1.x.toString(), encrypted.c1.y.toString()];
        let c2 = [encrypted.c2.x.toString(), encrypted.c2.y.toString()];

        let paillierViewKey = paillierPrivateKey.publicKey.encrypt(encrypted.k);
        await mockERC20.approve(axiomPay.target, value);

        const data = axiomPay.interface.getAbiCoder().encode(['tuple(uint[2] C1, uint[2] C2, uint256 viewKey, bytes proof)'], [{ C1: c1, C2: c2, viewKey: paillierViewKey, proof: "0x" }]);
        await expect(axiomPay.privateTransfer(users[0], users[1], value, data)).to.be.revertedWithCustomError(axiomPay, "ErrDecimalTruncate");
    });

    it("Should revert ErrTxTypeNotSupported", async () => {
        const value = 123456;
        let encrypted = await elgamalEncrypt(keys1.publicKey, value);

        let c1 = [encrypted.C1.x.toString(), encrypted.C1.y.toString()];
        let c2 = [encrypted.C2.x.toString(), encrypted.C2.y.toString()];

        let paillierViewKey = paillierPrivateKey.publicKey.encrypt(encrypted.k);
        await mockERC20.approve(axiomPay.target, value);
        const data = axiomPay.interface.getAbiCoder().encode(['tuple(uint[2] C1, uint[2] C2, uint256 viewKey, bytes proof)'], [{ C1: c1, C2: c2, viewKey: paillierViewKey, proof: "0x" }]);
        await expect(axiomPay.privateTransfer(users[0], users[3], value, data)).to.be.revertedWithCustomError(axiomPay, "ErrTxTypeNotSupported");
    });

    describe("Should transfer correct", async () => {
        let amount;
        let dec;
        before("register private account", async () => {
            amount = 22;
            dec = 1_0000000000000000n;
            await twinToken.registerAccount(users[1], await packPoint(keys1.publicKey).toString(16));
            await twinToken.registerAccount(users[2], await packPoint(keys2.publicKey).toString(16));
        });

        it("Step 1. Should get correct balance when test public -> private", async () => {
            const user0Before = await axiomPay.balanceOf(users[0]);
            const contractBefore = await axiomPay.balanceOf(axiomPay.target);
            expect(contractBefore).to.be.equals(0n);

            // public -> private
            let c_b_amount = await elgamalEncrypt(keys1.publicKey, amount);

            await mockERC20.approve(axiomPay.target, BigInt(amount) * dec);
            let paillierViewKey = paillierPrivateKey.publicKey.encrypt(c_b_amount.randomness);

            // 1: generate input
            console.log("====== start generate input =======")
            const inputPath = "utils/resources/pub2priv/input.json"
            fs.writeFileSync(
                inputPath, genPub2PrivInput(keys1.publicKey, c_b_amount.randomness.valueOf(), 0n, amount,
                    c_b_amount.C1, c_b_amount.C2)
            );

            // 2: generate witness
            console.log("====== start generate witness =======")
            const wasmPath = "utils/resources/pub2priv/axiompay.wasm"
            const wtnsPath = "utils/resources/pub2priv/witness.wtns"
            await generateWitness(inputPath, wasmPath, wtnsPath)

            await sleep(200);

            // 3: generate proof and public
            console.log("====== start generate proof and public =======")
            const proofPath = "utils/resources/pub2priv/proof.json"
            const publicPath = "utils/resources/pub2priv/public.json"
            const zkeyPath = "utils/resources/pub2priv/axiompay1.zkey";
            await generateProof(proofPath, publicPath, zkeyPath, wtnsPath);

            // 4: call contract
            // public input is just part of the whole public signals
            console.log("====== start call contract =======")
            let rawProof = await generateGroth16SolidityCallData(proofPath, publicPath);
            const parsedProof = JSON.parse("[" + rawProof + "]");
            let pA = [parsedProof[0][0], parsedProof[0][1]];
            let pB = [[parsedProof[1][0][0], parsedProof[1][0][1]], [parsedProof[1][1][0], parsedProof[1][1][1]]];
            let pC = [parsedProof[2][0], parsedProof[2][1]];
            let pubSignals = [parsedProof[3][0]];

            let proof = axiomPay.interface.getAbiCoder().encode(['tuple(uint[2] pA, uint[2][2] pB, uint[2] pC, uint[1] pubSignals)'], [{
                pA: pA,
                pB: pB,
                pC: pC,
                pubSignals: pubSignals
            }]);

            let data = axiomPay.interface.getAbiCoder().encode(['tuple(uint[2] C1, uint[2] C2, uint256 viewKey, bytes proof)'],
                [{
                    C1: [c_b_amount.C1.x.toString(), c_b_amount.C1.y.toString()],
                    C2: [c_b_amount.C2.x.toString(), c_b_amount.C2.y.toString()],
                    viewKey: paillierViewKey,
                    proof: proof
                }]);

            await axiomPay.privateTransfer(users[0], users[1].address, BigInt(amount) * dec, data);

            let balance = await axiomPay.privateBalanceOf(users[1].address);

            let [c1Point, c2Point] = encodeToPoint(balance);

            let decryptRes = await decryptFromChainRes(c1Point, c2Point, keys1.privateKey);
            expect(decryptRes).to.be.equals(amount);

            let viewRes = await viewFromChainRes(c2Point, c_b_amount.randomness, keys1.publicKey);
            expect(viewRes).to.be.equals(amount);

            const user0After = await axiomPay.balanceOf(users[0].address);
            expect(user0Before - user0After).to.be.equals(BigInt(amount) * dec);

            const contractAfter = await axiomPay.balanceOf(axiomPay.target);
            expect(contractAfter - contractBefore).to.be.equals(BigInt(amount) * dec);

            console.log("finish public -> private with zk");
        });

        it("Step 2. Should get correct balance when test private -> private", async () => {
            let balance_amount_onchain = await axiomPay.privateBalanceOf(users[1]);
            const balance_amount = encodeToPoint(balance_amount_onchain);
            const bal = await decryptFromChainRes(balance_amount[0], balance_amount[1], keys1.privateKey);
            expect(bal).to.be.equals(amount);

            // private -> private
            let c_a_amount = await elgamalEncrypt(keys1.publicKey, amount);
            let fromPaillierViewKey = paillierPrivateKey.publicKey.encrypt(c_a_amount.randomness);

            let c_b_amount = await elgamalEncrypt(keys2.publicKey, amount);
            let toPaillierViewKey = paillierPrivateKey.publicKey.encrypt(c_b_amount.randomness);

            // 1: generate input
            console.log("====== start generate input =======")
            const inputPath = "utils/resources/priv2priv/input.json"
            fs.writeFileSync(
                inputPath, genPriv2PrivInput(keys1.publicKey, keys2.publicKey,
                    c_a_amount.randomness.valueOf(), c_b_amount.randomness.valueOf(), bal, amount,
                    balance_amount[0], balance_amount[1], keys1.privateKey,
                    c_a_amount.C1, c_b_amount.C1,
                    c_a_amount.C2, c_b_amount.C2)
            );

            // 2: generate witness
            console.log("====== start generate witness =======")
            const wasmPath = "utils/resources/priv2priv/axiompay.wasm"
            const wtnsPath = "utils/resources/priv2priv/witness.wtns"
            await generateWitness(inputPath, wasmPath, wtnsPath)

            await sleep(200);

            // 3: generate proof and public
            console.log("====== start generate proof and public =======")
            const proofPath = "utils/resources/priv2priv/proof.json"
            const publicPath = "utils/resources/priv2priv/public.json"
            const zkeyPath = "utils/resources/priv2priv/axiompay1.zkey";
            await generateProof(proofPath, publicPath, zkeyPath, wtnsPath)

            // 4: call contract
            // public input is just part of the whole public signals
            console.log("====== start call contract =======")
            let rawProof = await generateGroth16SolidityCallData(proofPath, publicPath);

            const parsedProof = JSON.parse("[" + rawProof + "]")
            let pA = [parsedProof[0][0], parsedProof[0][1]]
            let pB = [[parsedProof[1][0][0], parsedProof[1][0][1]], [parsedProof[1][1][0], parsedProof[1][1][1]]]
            let pC = [parsedProof[2][0], parsedProof[2][1]]
            let pubSignals = [parsedProof[3][0]]

            let proof = axiomPay.interface.getAbiCoder().encode(['tuple(uint[2] pA, uint[2][2] pB, uint[2] pC, uint[1] pubSignals)'], [{
                pA: pA,
                pB: pB,
                pC: pC,
                pubSignals: pubSignals
            }]);

            let data = axiomPay.interface.getAbiCoder().encode(['tuple(uint[2] fromC1, uint[2] fromC2, uint[2] toC1, uint[2] toC2, uint256 fromViewKey, uint256 toViewKey, bytes proof)'],
                [{
                    fromC1: [c_a_amount.C1.x.toString(), c_a_amount.C1.y.toString()],
                    fromC2: [c_a_amount.C2.x.toString(), c_a_amount.C2.y.toString()],
                    toC1: [c_b_amount.C1.x.toString(), c_b_amount.C1.y.toString()],
                    toC2: [c_b_amount.C2.x.toString(), c_b_amount.C2.y.toString()],
                    fromViewKey: fromPaillierViewKey,
                    toViewKey: toPaillierViewKey,
                    proof: proof
                }]
            );

            await axiomPay.privateTransfer(users[1], users[2], BigInt(amount) * dec, data);

            let balance = await axiomPay.privateBalanceOf(users[1].address);

            let [c1Point, c2Point] = encodeToPoint(balance);

            let decryptRes = await decryptFromChainRes(c1Point, c2Point, keys1.privateKey);
            expect(decryptRes).to.be.equals(0);

            balance = await axiomPay.privateBalanceOf(users[2].address);

            [c1Point, c2Point] = encodeToPoint(balance);

            decryptRes = await decryptFromChainRes(c1Point, c2Point, keys2.privateKey);
            expect(decryptRes).to.be.equals(amount);

            const viewRes = await viewFromChainRes(c2Point, c_b_amount.randomness, keys2.publicKey);
            expect(viewRes).to.be.equals(amount);

            console.log("finish private -> private with zk");
        });

        it("Step 3. Should get correct balance when test private -> public", async () => {
            const contractBefore = await axiomPay.balanceOf(axiomPay.target);
            expect(contractBefore).to.be.equals(BigInt(amount) * dec);

            let balance_amount_onchain = await axiomPay.privateBalanceOf(users[2]);
            const balance_amount = encodeToPoint(balance_amount_onchain);
            const bal = await decryptFromChainRes(balance_amount[0], balance_amount[1], keys2.privateKey);
            expect(bal).to.be.equals(amount);

            let c_a_amount = await elgamalEncrypt(keys2.publicKey, amount);
            let fromPaillierViewKey = paillierPrivateKey.publicKey.encrypt(c_a_amount.randomness);
            await mockERC20.transfer(axiomPay.target, BigInt(amount) * dec);

            // 1: generate input
            console.log("====== start generate input =======")
            const inputPath = "utils/resources/priv2pub/input.json"
            fs.writeFileSync(
                inputPath, genPriv2PubInput(keys2.publicKey, c_a_amount.randomness.valueOf(), bal, amount,
                    balance_amount[0], balance_amount[1], keys2.privateKey,
                    c_a_amount.C1, c_a_amount.C2)
            );

            // 2: generate witness
            console.log("====== start generate witness =======")
            const wasmPath = "utils/resources/priv2pub/axiompay.wasm"
            const wtnsPath = "utils/resources/priv2pub/witness.wtns"
            await generateWitness(inputPath, wasmPath, wtnsPath)

            await sleep(200); // wait for generating witness

            // 3: generate proof and public
            console.log("====== start generate proof and public =======")
            const proofPath = "utils/resources/priv2pub/proof.json"
            const publicPath = "utils/resources/priv2pub/public.json"
            const zkeyPath = "utils/resources/priv2pub/axiompay1.zkey";
            await generateProof(proofPath, publicPath, zkeyPath, wtnsPath)

            // 4: call contract
            // public input is just part of the whole public signals
            console.log("====== start call contract =======")
            let rawProof = await generateGroth16SolidityCallData(proofPath, publicPath)
            const parsedProof = JSON.parse("[" + rawProof + "]")
            let pA = [parsedProof[0][0], parsedProof[0][1]]
            let pB = [[parsedProof[1][0][0], parsedProof[1][0][1]], [parsedProof[1][1][0], parsedProof[1][1][1]]]
            let pC = [parsedProof[2][0], parsedProof[2][1]]
            let pubSignals = [parsedProof[3][0]]

            let proof = axiomPay.interface.getAbiCoder().encode(['tuple(uint[2] pA, uint[2][2] pB, uint[2] pC, uint[1] pubSignals)'], [{
                pA: pA,
                pB: pB,
                pC: pC,
                pubSignals: pubSignals
            }]);

            let data = axiomPay.interface.getAbiCoder().encode(['tuple(uint[2] C1, uint[2] C2, uint256 viewKey, bytes proof)'],
                [{
                    C1: [c_a_amount.C1.x.toString(), c_a_amount.C1.y.toString()],
                    C2: [c_a_amount.C2.x.toString(), c_a_amount.C2.y.toString()],
                    viewKey: fromPaillierViewKey,
                    proof: proof
                }]);

            const before = await axiomPay.balanceOf(users[0]);

            await axiomPay.privateTransfer(users[2], users[0], BigInt(amount) * dec, data);

            const after = await axiomPay.balanceOf(users[0]);
            expect(after - before).to.be.equals(BigInt(amount) * dec);

            let balance = await axiomPay.privateBalanceOf(users[2].address);

            let [c1Point, c2Point] = encodeToPoint(balance);

            let decryptRes = await decryptFromChainRes(c1Point, c2Point, keys2.privateKey);
            expect(decryptRes).to.be.equals(0);

            console.log("finish private -> public with zk");
        });

        it("Step 4. Should transfer correct from plain to plain", async () => {
            const value = 1000000000000000000n;

            await mockERC20.approve(axiomPay.target, value);
            const user0Before = await axiomPay.balanceOf(users[0]);
            const user3Before = await axiomPay.balanceOf(users[3]);

            await axiomPay.transfer(users[3].address, value);

            const user0After = await axiomPay.balanceOf(users[0]);
            expect(user0Before - user0After).to.be.equals(BigInt(value));
            const user3After = await axiomPay.balanceOf(users[3]);
            expect(user3After - user3Before).to.be.equals(BigInt(value));
        });

        after("sleep a while to wait the gas report", async () => {
            await sleep(5000);
        })
    });
});