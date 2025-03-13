import { JSONFileSync, LowSync } from "@commonify/lowdb";

const FILENAME = "db.json";

const defaultDBData = {
    contracts: [],
    cryptoParams: undefined
}

const adapter = new JSONFileSync(FILENAME);
const db = new LowSync(adapter);
db.read();
if (!db.data) {
    console.log(`not find db file ${FILENAME}, will create one with default value`);
    db.data = defaultDBData;
    db.write();
}

export function updateContract(key, value) {
    let res = db.data?.contracts.find(contract => contract.contractName === key);
    if (res) {
        res.contractAddress = value;
    } else {
        db.data?.contracts.push({ contractName: key, contractAddress: value });
    }
    db.write();
}

export function getContract(key) {
    let res = db.data?.contracts.find(contract => contract.contractName === key);
    return res?.contractAddress;
}

export function setCrypto(value) {
    if (!db.data) { throw new Error("error read db"); }
    db.data.cryptoParams = value;
    db.write();
}

export function getCrypto() {
    if (!db.data) { throw new Error("err read db"); }
    return db.data.cryptoParams;
}