const Transfer = artifacts.require("Transfer");

module.exports = function (deployer) {
  deployer.deploy(Transfer);
};
