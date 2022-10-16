const { execSync } = require('child_process');
const ProofPath = '../proof';
const PrepareProof = '../proof/prepare_proof';

exports.CompileCircuit = CompileCircuit;
exports.generateProof = generateProof;

function execute(StringName)
{
    execSync(StringName,{stdio:'inherit',stdin:'inherit'})
}

function CompileCircuit()
{
    console.log('Compiling circuit....')
    execute('circom ../circuits/withdraw.circom --r1cs --wasm --sym --output ../proof/prepare_proof');
    
    console.log('Creating zkey file...')
    execute('snarkjs groth16 setup ../proof/prepare_proof/withdraw.r1cs ../proof/prepare_proof/powersOfTau28_hez_final_18.ptau ../proof/withdraw.zkey')

    
    console.log('Creating final zkey file...')
    execute('snarkjs zkey contribute ../proof/withdraw.zkey ../proof/withdraw_final.zkey --name="1st Contributor Name" -v')

    
    console.log('Exporting the verification key:')
    execute('snarkjs zkey export verificationkey ../proof/withdraw_final.zkey ../proof/withdraw_key.json')

    console.log('Generating a Smart Contract ...')
    execute('snarkjs zkey export solidityverifier ../proof/withdraw_final.zkey ../contracts/WithdrawVerifier.sol')
}

function generateProof()
{
    console.log('Caculate witness....')
    execute('node ../proof/prepare_proof/withdraw_js/generate_witness.js ../proof/prepare_proof/withdraw_js/withdraw.wasm ../input/withdraw_input.json ../proof/witness.wtns');

    console.log('Generating a Proof...')
    execute('snarkjs groth16 prove ../proof/withdraw_final.zkey ../proof/witness.wtns ../proof/proof_withdraw.json ../proof/public_withdraw.json')

    console.log('Verifying a Proof...')
    execute('snarkjs groth16 verify ../proof/withdraw_key.json ../proof/public_withdraw.json ../proof/proof_withdraw.json')
}

CompileCircuit();
// generateProof();

