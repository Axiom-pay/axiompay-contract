source .env

export ETH_RPC_URL="https://rpc1.taurus.axiomesh.io"
FILEDIR="artifacts/contracts"
JSONKEY='.bytecode'
GASLIMIT=10000000
GASPRICE=1000000000000
# BYTECODE=

BLUE='\033[0;34m'
GREEN='\033[0;32m'

function print_blue() {
    printf "${BLUE}%s${NC}\n" "$1"
}

function print_green() {
    printf "${GREEN}%s${NC}\n" "$1"
}

function get_bytecode() {
    dir="$FILEDIR"/"$1"
    BYTECODE=$(jq $JSONKEY "$dir")
    BYTECODE=$(echo "$BYTECODE" | tr -d '"')
    echo "$BYTECODE"
}

print_blue "----step 1: deploy----"
BYTECODE=$(get_bytecode zk/Priv2PrivVerifier.sol/Priv2PrivVerifier.json)
cast send --private-key $PRIVATE_KEY --gas-limit $GASLIMIT --gas-price $GASPRICE --create $BYTECODE
print_green "deploy success"
