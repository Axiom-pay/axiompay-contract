import { groth16 } from "snarkjs";
import bfj from "bfj";
import { utils } from "ffjavascript";

const { stringifyBigInts } = utils;

// const wc = require("./circuit/witness_calculator.js");
import { builder } from "./circuit/witness_calculator.js";
import { readFileSync, writeFile } from "fs";

export async function generateWitness(inputPath, wasmPath, wtnsPath) {
    const input = JSON.parse(readFileSync(inputPath, "utf8"));
    const wasm = readFileSync(wasmPath);
    // console.log("[generateWitness] input=", input);

    await builder(wasm).then(async witnessCalculator => {
        const buff = await witnessCalculator.calculateWTNSBin(input, 0);
        writeFile(wtnsPath, buff, function (err) {
            if (err) throw err;
        });
    });
}

export async function generateProof(proofPath, publicPath, zkeyPath, wtnsPath) {
    console.log("[generateProof]")

    let start = performance.now();
    const { proof, publicSignals } = await groth16.prove(zkeyPath, wtnsPath);
    console.log(`time consuming ${performance.now() - start}ms`);

    await bfj.write(proofPath, stringifyBigInts(proof), { space: 1 });
    await bfj.write(publicPath, stringifyBigInts(publicSignals), { space: 1 });
}

export async function generateGroth16SolidityCallData(proofPath, publicPath) {
    const pub = JSON.parse(readFileSync(publicPath, "utf8"));
    const prf = JSON.parse(readFileSync(proofPath, "utf8"));

    return await groth16.exportSolidityCallData(prf, pub)
}

/**
 * Generates an input map based on the given parameters and returns it as a JSON string.
 *
 * @param {import("babyjubjub-utils").Point} pa - The affine point representing pa.
 * @param {import("babyjubjub-utils").Point} pb - The affine point representing pb.
 * @param {bigint} vk1 - The vk2 value.
 * @param {bigint} vk2 - The vk3 value.
 * @param {bigint} rawBalance - The raw balance value.
 * @param {bigint} rawAmount - The raw amount value.
 * @param {import("babyjubjub-utils").Point} CABalanceC1 - The affine point representing CABalanceC1.
 * @param {import("babyjubjub-utils").Point} CABalanceC2 - The affine point representing CABalanceC2.
 * @param {bigint} privateKey - The private key value.
 * @param {import("babyjubjub-utils").Point} CAAmountC1 - The affine point representing CAAmountC1.
 * @param {import("babyjubjub-utils").Point} CBAmountC1 - The affine point representing CBAmountC1.
 * @param {import("babyjubjub-utils").Point} CAAmountC2 - The affine point representing CAAmountC2.
 * @param {import("babyjubjub-utils").Point} CBAmountC2 - The affine point representing CBAmountC2.
 * @return {string} The generated input as a JSON string.
 */
export function genPriv2PrivInput(pa, pb, vk1, vk2, rawBalance, rawAmount,
    CABalanceC1, CABalanceC2, privateKey, CAAmountC1, CBAmountC1,
    CAAmountC2, CBAmountC2) {
    let input = new Map();
    input.set("pa", [pa.x.toString(), pa.y.toString()])
    input.set("pb", [pb.x.toString(), pb.y.toString()])
    input.set("caAmountK", vk1.toString())
    input.set("cbAmountK", vk2.toString())
    input.set("c1ayAmount", CAAmountC1.y.toString())
    input.set("c1byAmount", CBAmountC1.y.toString())
    input.set("c2ayAmount", CAAmountC2.y.toString())
    input.set("c2byAmount", CBAmountC2.y.toString())
    input.set("c1balance", [CABalanceC1.x.toString(), CABalanceC1.y.toString()])
    input.set("c2balance", [CABalanceC2.x.toString(), CABalanceC2.y.toString()])
    input.set("privateKey", privateKey.toString())
    input.set("balance", rawBalance.toString())
    input.set("amount", rawAmount.toString())

    // console.log("input map =", input)
    return JSON.stringify(Object.fromEntries(input));
}

/**
 * Generate a public input from private input for a specific cryptographic operation.
 *
 * @param {import("babyjubjub-utils").Point} pa - the affine point for a specific operation
 * @param {bigint} vk - the verification key
 * @param {bigint} rawBalance - the raw balance value
 * @param {bigint} rawAmount - the raw amount value
 * @param {import("babyjubjub-utils").Point} CABalanceC1 - the affine point for balance C1
 * @param {import("babyjubjub-utils").Point} CABalanceC2 - the affine point for balance C2
 * @param {bigint} privateKey - the private key for the operation
 * @param {import("babyjubjub-utils").Point} CAAmountC1 - the affine point for amount C1
 * @param {import("babyjubjub-utils").Point} CAAmountC2 - the affine point for amount C2
 * @return {string} the public input in JSON string format
 */
export function genPriv2PubInput(pa, vk, rawBalance, rawAmount,
    CABalanceC1, CABalanceC2, privateKey,
    CAAmountC1, CAAmountC2) {
    let input = new Map();
    input.set("pa", [pa.x.toString(), pa.y.toString()])
    input.set("caAmountK", vk.toString())
    input.set("c1ayAmount", CAAmountC1.y.toString())
    input.set("c2ayAmount", CAAmountC2.y.toString())
    input.set("c1balance", [CABalanceC1.x.toString(), CABalanceC1.y.toString()])
    input.set("c2balance", [CABalanceC2.x.toString(), CABalanceC2.y.toString()])
    input.set("privateKey", privateKey.toString())
    input.set("balance", rawBalance.toString())
    input.set("amount", rawAmount.toString())

    // console.log("input map =", input)
    return JSON.stringify(Object.fromEntries(input));
}

/**
 * Generates a JSON string from the given input values.
 *
 * @param {import("babyjubjub-utils").Point} pb - the public key
 * @param {bigint} vk - the verification key
 * @param {bigint} rawBalance - the raw balance
 * @param {bigint} rawAmount - the raw amount
 * @param {import("babyjubjub-utils").Point} CBAmountC1 - the first affine point
 * @param {import("babyjubjub-utils").Point} CBAmountC2 - the second affine point
 * @return {string} the JSON string representation of the input values
 */
export function genPub2PrivInput(pb, vk, rawBalance, rawAmount,
    CBAmountC1, CBAmountC2) {
    let input = new Map();
    input.set("pb", [pb.x.toString(), pb.y.toString()]);
    input.set("cbAmountK", vk.toString());
    input.set("c1byAmount", CBAmountC1.y.toString());
    input.set("c2byAmount", CBAmountC2.y.toString());
    input.set("balance", rawBalance.toString());
    input.set("amount", rawAmount.toString());

    // console.log("input map =", input);
    return JSON.stringify(Object.fromEntries(input));
}
