import { elgamalDecrypt, compute_dlog, getBabyJub, addPoints, unpackPoint } from "babyjubjub-utils";
import os from "os";

export function encodeToPoint(balance) {
    // if (balance.c1[0] === 0n && balance.c1[1] === 0n && balance.c2[0] === 0n && balance.c2[1] === 0n) {
    //     throw new Error("balance is zero");
    // }
    let affineC1 = {
        x: balance.c1[0],
        y: balance.c1[1]
    }
    let affineC2 = {
        x: balance.c2[0],
        y: balance.c2[1]
    }
    return [affineC1, affineC2];
}

/**
 * Decrypts the given ciphertext from the chain response using the provided private key.
 *
 * @param {import("babyjubjub-utils").Point} c1 - description of parameter
 * @param {import("babyjubjub-utils").Point} c2 - description of parameter
 * @param {bigint} privateKey - description of parameter
 * @return {number} the decrypted value
 */
export async function decryptFromChainRes(c1, c2, privateKey) {
    return elgamalDecrypt(privateKey, c1, c2, os.cpus().length);
}

/**
 * Calculate the res from the view key.
 *
 * @param {import("babyjubjub-utils").Point} c2 - description of parameter
 * @param {bigint} viewKey - description of parameter
 * @param {import("babyjubjub-utils").Point} publicKey - description of parameter
 * @return {number} description of return value
 */
export async function viewFromChainRes(c2, viewKey, publicKey) {
    const babyJub = await getBabyJub();
    let rhs = babyJub.mulPointEscalar([babyJub.F.e(publicKey.x), babyJub.F.e(publicKey.y)], viewKey);
    // multiply to the order-1 to get the inverse of a point
    let inv = babyJub.mulPointEscalar(rhs, 2736030358979909402780800718157159386076813972158567259200215660948447373040n);
    const embeded = await babyJub.addPoint([babyJub.F.e(c2.x), babyJub.F.e(c2.y)], inv);
    const input = {
        x: babyJub.F.toObject(embeded[0]),
        y: babyJub.F.toObject(embeded[1])
    }
    return compute_dlog(input, os.cpus().length);
}
