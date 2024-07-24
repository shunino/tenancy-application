
const TenancyContract = artifacts.require("TenancyContract");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(TenancyContract);
};