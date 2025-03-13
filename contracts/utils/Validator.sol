// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../zk/Priv2PrivVerifier.sol";
import "../zk/Priv2PubVerifier.sol";
import "../zk/Pub2PrivVerifier.sol";

contract Validator {
    Priv2PrivVerifier private priv2PrivVerifier;
    Priv2PubVerifier private priv2PubVerifier;
    Pub2PrivVerifier private pub2PrivVerifier;

    struct Priv2PrivProof {
        uint[2] pA;
        uint[2][2] pB;
        uint[2] pC;
        uint[1] pubSignals;
    }

    struct Priv2PubProof {
        uint[2] pA;
        uint[2][2] pB;
        uint[2] pC;
        uint[1] pubSignals;
    }

    struct Pub2PrivProof {
        uint[2] pA;
        uint[2][2] pB;
        uint[2] pC;
        uint[1] pubSignals;
    }

    constructor(
        Priv2PrivVerifier _priv2PrivVerifier,
        Priv2PubVerifier _priv2PubVerifier,
        Pub2PrivVerifier _pub2PrivVerifier
    ) {
        priv2PrivVerifier = _priv2PrivVerifier;
        priv2PubVerifier = _priv2PubVerifier;
        pub2PrivVerifier = _pub2PrivVerifier;
    }

    /**
     * validate the proof
     * @param proof - the proof
     * @return - true if the proof is valid
     */
    function validatePriv2Priv(
        uint[2] calldata fromC1,
        uint[2] calldata fromC2,
        uint[2] calldata toC1,
        uint[2] calldata toC2,
        uint[2] calldata balanceC1,
        uint[2] calldata balanceC2,
        bytes memory proof
    ) external view returns (bool) {
        Priv2PrivProof memory priv2PrivProof;
        uint[2] memory ca_amount_c1 = (uint[2])(fromC1);
        uint[2] memory cb_amount_c1 = (uint[2])(toC1);
        uint[2] memory ca_amount_c2 = (uint[2])(fromC2);
        uint[2] memory cb_amount_c2 = (uint[2])(toC2);
        uint[2] memory balance_c1 = (uint[2])(balanceC1);
        uint[2] memory balance_c2 = (uint[2])(balanceC2);

        (priv2PrivProof) = abi.decode(proof, (Priv2PrivProof));

        uint[8] memory pubSignals;
        pubSignals[0] = ca_amount_c1[1];
        pubSignals[1] = cb_amount_c1[1];
        pubSignals[2] = ca_amount_c2[1];
        pubSignals[3] = cb_amount_c2[1];
        pubSignals[4] = balance_c1[0];
        pubSignals[5] = balance_c1[1];
        pubSignals[6] = balance_c2[0];
        pubSignals[7] = balance_c2[1];
        return
            priv2PrivVerifier.verifyProof(
                priv2PrivProof.pA,
                priv2PrivProof.pB,
                priv2PrivProof.pC,
                pubSignals
            );
    }

    function validatePriv2Pub(
        uint[2] calldata fromC1,
        uint[2] calldata fromC2,
        uint[2] calldata balanceC1,
        uint[2] calldata balanceC2,
        bytes memory proof
    ) external view returns (bool) {
        Priv2PubProof memory priv2PubProof;
        uint[2] memory ca_amount_c1 = (uint[2])(fromC1);
        uint[2] memory ca_amount_c2 = (uint[2])(fromC2);
        uint[2] memory balance_c1 = (uint[2])(balanceC1);
        uint[2] memory balance_c2 = (uint[2])(balanceC2);

        (priv2PubProof) = abi.decode(proof, (Priv2PubProof));

        uint[6] memory pubSignals;
        pubSignals[0] = ca_amount_c1[1];
        pubSignals[1] = ca_amount_c2[1];
        pubSignals[2] = balance_c1[0];
        pubSignals[3] = balance_c1[1];
        pubSignals[4] = balance_c2[0];
        pubSignals[5] = balance_c2[1];

        return
            priv2PubVerifier.verifyProof(
                priv2PubProof.pA,
                priv2PubProof.pB,
                priv2PubProof.pC,
                pubSignals
            );
    }

    function validatePub2Priv(
        uint[2] calldata toC1,
        uint[2] calldata toC2,
        bytes memory proof
    ) external view returns (bool) {
        Pub2PrivProof memory pub2PrivProof;
        uint[2] memory cb_amount_c1 = (uint[2])(toC1);
        uint[2] memory cb_amount_c2 = (uint[2])(toC2);

        (pub2PrivProof) = abi.decode(proof, (Pub2PrivProof));

        uint[2] memory pubSignals;
        pubSignals[0] = cb_amount_c1[1];
        pubSignals[1] = cb_amount_c2[1];

        return
            pub2PrivVerifier.verifyProof(
                pub2PrivProof.pA,
                pub2PrivProof.pB,
                pub2PrivProof.pC,
                pubSignals
            );
    }

    function bigintToArray(uint origin) private pure returns (uint[4] memory) {
        uint mod = 2 ** 64;
        uint[4] memory res;
        for (uint i = 0; i < 4; i++) {
            res[i] = origin % mod;
            origin = origin / mod;
        }
        return res;
    }
}
