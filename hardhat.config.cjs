require("@nomicfoundation/hardhat-toolbox");
require("solidity-docgen");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: "your_rpc_url",
      accounts: ["your_private_key"],
    },
  },
  docgen: {
    pages: "files",
  },
};
