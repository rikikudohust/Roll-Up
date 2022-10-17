const hre = require("hardhat");

const {contract} = require('./config/configuration');

async function main() {
    
    const Rollup = await hre.ethers.getContractFactory("Rollup");
    const rollup = await Rollup.deploy(contract.merkle);

    await rollup.deployed();

    console.log(
        `Deployed to ${rollup.address}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});