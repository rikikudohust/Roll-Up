const { expect } = require("chai");
const {CompileCircuit,generateProof} = require("../script/Compile_and_create_proof");
const snarkjs = require("snarkjs");
const fs = require("fs");

// async function run() {
//     const input= require("../input/input.json");
//     const wasmFile = "../proof/prepare_proof/multiple_tokens_transfer_and_withdraw_js/multiple_tokens_transfer_and_withdraw.wasm";
//     const zkeyFile = "../proof/multiple_tokens_transfer_and_withdraw_final.zkey";
//     console.log(input);
//     const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasmFile, zkeyFile);

//     console.log("Proof: ");
//     console.log(JSON.stringify(proof, null, 1));

//     const vKey = JSON.parse(fs.readFileSync("verification_key.json"));

//     const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

//     if (res === true) {
//         console.log("Verification OK");
//     } else {
//         console.log("Invalid proof");
//     }
// }

// run().then(() => {
//     process.exit(0);
// });

describe("Main", async function () {
    it("Should return true if input batch transaction is valid", async function () {
    //generateProof();
    const Verifier = await hre.ethers.getContractFactory("Verifier");
    const verifier = await Verifier.deploy();
    await verifier.deployed();
    
    const input= require("../input/input.json");
    const wasmFile = "../proof/prepare_proof/multiple_tokens_transfer_and_withdraw_js/multiple_tokens_transfer_and_withdraw.wasm";
    const zkeyFile = "../proof/multiple_tokens_transfer_and_withdraw_final.zkey";
    //console.log(input);

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(input,  wasmFile,zkeyFile );
    console.log("Proof: ");
    console.log(proof);
    //let proof = require("../proof/proof.json");
    const updateA = [
        proof.pi_a[0], proof.pi_a[1]
    ]
    const updateB = [
        [proof.pi_b[0][1], proof.pi_b[0][0]],
        [proof.pi_b[1][1], proof.pi_b[1][0]],
    ]
    const updateC = [
        proof.pi_c[0], proof.pi_c[1]
    ]
    //const updateInput = require("../proof/public.json");
    
    const result = await verifier.verifyProof(
        updateA, updateB, updateC, publicSignals
    );

    expect(result).to.be.equals(true);
    });
});