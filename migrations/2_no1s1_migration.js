const no1s1 = artifacts.require("no1s1data");

// module.exports = function (deployer) {
//   deployer.deploy(no1s1SMC);
// };

module.exports = function (deployer, network, accounts) {
  deployer.deploy(no1s1,{from:accounts[0]});
};
