import { generateRandomKeysSync, PrivateKey, PublicKey } from "paillier-bigint";
import { getCrypto, setCrypto } from "./storage.mjs";

const defaultKeyBitSize = 128;

function convertBigIntToString(obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                // If the property is an object, recursively call the function.
                convertBigIntToString(obj[key]);
            } else if (typeof obj[key] === 'bigint') {
                // If the property is a BigInt, convert it to a string.
                obj[key] = obj[key].toString();
            }
        }
    }
}

function convertStringToBigInt(obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                // If the property is an object, recursively call the function.
                convertStringToBigInt(obj[key]);
            } else if (typeof obj[key] === 'string') {
                // If the property is a BigInt, convert it to a string.
                obj[key] = BigInt(obj[key]);
            }
        }
    }
}

export function generateOrRetriveKeys() {
    let crypto = getCrypto();
    if (crypto) {
        convertStringToBigInt(crypto);
        const publicKey = new PublicKey(crypto.publicKey.n, crypto.publicKey.g);
        crypto = new PrivateKey(crypto.lambda, crypto.mu, publicKey, crypto._p, crypto._q);
        if (!(crypto instanceof PrivateKey)) {
            throw new Error("retrieve paillierNN error")
        }
        return crypto;
    }
    let keyPair = generateRandomKeysSync(defaultKeyBitSize);
    let key = keyPair.privateKey;
    convertBigIntToString(keyPair.privateKey);

    setCrypto(keyPair.privateKey);
    return key;
}