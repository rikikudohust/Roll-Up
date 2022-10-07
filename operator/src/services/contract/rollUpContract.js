const Rollup = require("./ABI/Rollup.json");
const {ethers} =  require("ethers");

module.exports = async function rollUpContract(address, provider) {
    const contract = new ethers.Contract(address, Rollup, provider);
    return contract;
}

