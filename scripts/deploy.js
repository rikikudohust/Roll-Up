// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { poseidonContract } = require("circomlibjs");

async function main() {
    let operator;
    [operator, ] = await ethers.getSigners();
    // Deploying the Poseidon hashing contract
    const P2 = new ethers.ContractFactory(
        poseidonContract.generateABI(2),
        poseidonContract.createCode(2),
        operator
    );
    const P4 = new ethers.ContractFactory(
        poseidonContract.generateABI(4),
        poseidonContract.createCode(4),
        operator
    );
    const P5 = new ethers.ContractFactory(
        poseidonContract.generateABI(5),
        poseidonContract.createCode(5),
        operator
    );
    const poseidon2 = await P2.deploy();
    const poseidon4 = await P4.deploy();
    const poseidon5 = await P5.deploy();

    var PoseidonMerkle = await ethers.getContractFactory("PoseidonMerkle");
    const poseidonMerkle = await PoseidonMerkle.deploy(
        poseidon2.address,
        poseidon4.address,
        poseidon5.address
    );

    const Rollup = await hre.ethers.getContractFactory("Rollup");
    const rollup = await Rollup.deploy(poseidonMerkle.address);

    await rollup.deployed();

    console.log(
        `Deployed to ${rollup.address}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});