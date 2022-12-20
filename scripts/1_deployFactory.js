const { deployments, ethers } = require("hardhat");

//npx hardhat run scripts\1_deployFactory.js --network avalanche

async function main() {
  //verification
  const verify = true;
  const sicleFactoryAddress = "0x2F0C7C98462651BB2102F6Cd05acDAd333E031b0";

  const [deployer] = await ethers.getSigners();
  console.log("deploy by acct: " + deployer.address);

  const bal = await deployer.getBalance();
  console.log("bal: " + bal);

  const SicleFactory = await ethers.getContractFactory("SicleFactory");
  const sicleFactory = verify
    ? await SicleFactory.attach(sicleFactoryAddress)
    : await SicleFactory.deploy(deployer.address); 
  console.log("await deployment...");
  await sicleFactory.deployed();
  console.log("SicleFactory:", sicleFactory.address);

  if (!verify) return;

  console.log("pairCodeHash:", await sicleFactory.pairCodeHash());
  console.log("verifying SicleFactory");
  await run("verify:verify", {
    address: sicleFactory.address,
    contract: "contracts/sicle/SicleFactory.sol:SicleFactory",
    constructorArguments: [deployer.address]
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
