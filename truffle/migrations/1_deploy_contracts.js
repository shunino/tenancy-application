const TenancyContract = artifacts.require("TenancyContract");

module.exports = function(deployer, network, accounts) {
  // deployAccount is the address of the landlord
  //const deployAccount = accounts[0];
  const deployAccount = '0x4B32AE490B3e7904688b0c0A09dFD67794cE2349';

  deployer.deploy(TenancyContract, { from: deployAccount });
};