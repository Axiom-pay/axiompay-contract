set -e

BLUE='\033[0;34m'
RED='\033[0;31m'

function print_blue() {
    printf "${BLUE}%s${NC}\n" "$1"
}

function print_red() {
    printf "${RED}%s${NC}\n" "$1"
}

filename=axiompay

mode=$1

case "$mode" in
"1")
    # build with r1cs arithmatic circuit
    circom $filename.circom --r1cs --wasm --sym

    # tau power
    print_blue "----start to set tau power----"
    snarkjs powersoftau new bn128 13 pot12_0000.ptau -v
    snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="1st contribution" -v
    snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
    snarkjs groth16 setup $filename.r1cs pot12_final.ptau "$filename"0.zkey
    snarkjs zkey contribute "$filename"0.zkey "$filename"1.zkey --name="1st Contribution" -v
    snarkjs zkey export verificationkey "$filename"1.zkey verification_key.json

    # rename file
    mv "$filename"_js/witness_calculator.js "$filename"_js/witness_calculator.cjs
    mv "$filename"_js/generate_witness.js "$filename"_js/generate_witness.cjs

    # clear up
    rm -rf *.ptau "$filename"0.zkey "$filename".sym
    ;;
"2")
    # compute witness
    print_blue "----start to compute witness----"
    node "$filename"_js/generate_witness.cjs "$filename"_js/$filename.wasm input.json witness.wtns
    # generate proof
    print_blue "----start to generate proof----"
    snarkjs groth16 prove "$filename"1.zkey witness.wtns proof.json public.json
    # verify proof
    print_blue "----start to verify proof----"
    snarkjs groth16 verify verification_key.json public.json proof.json
    ;;
"3")
    # generate solidity verifier
    print_blue "----start to generate solidity verifier----"
    snarkjs zkey export solidityverifier "$filename"1.zkey Verifier.sol
    ;;
"4")
    # clear up
    print_blue "----start to clear up----"
    rm -rf *.r1cs *.zkey "$filename"_js proof.json public.json verification_key.json *.wtns *.sym
    ;;
*)
    # echo help
    print_blue "Usage: of $0 with flags [1|2|3|4]"
    echo "\t- 1: build with r1cs arithmatic circuit"
    echo "\t- 2: compute witness and calculate proof"
    echo "\t- 3: generate solidity verifier"
    echo "\t- 4: clear up"
    ;;
esac
