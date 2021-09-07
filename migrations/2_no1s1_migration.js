const no1s1App = artifacts.require("no1s1App");
const no1s1Data = artifacts.require("no1s1Data");

module.exports = async function(deployer) {
	// deploy no1s1Data and store return value
	await deployer.deploy(no1s1Data);
  // deploy no1s1App and pass address of no1s1Data
	deployer.deploy(no1s1App, no1s1Data.address);
};