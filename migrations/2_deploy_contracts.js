const Lending = artifacts.require("Lending");

module.exports = function(deployer) {
  deployer.deploy(Lending, "YOUR_WALLET_ADDRESS");
};
