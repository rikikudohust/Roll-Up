// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract IPoseidonMerkle {
    uint256[16] public zeroCache;

    function getRootFromProof(
        uint256,
        uint256[] memory,
        uint256[] memory
    ) external view returns (uint256) {}

    function hashPoseidon(uint256[] calldata) external view returns (uint256) {}
}

contract IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public returns (bool) {}

    function transfer(address recipient, uint256 value) public returns (bool) {}
}

contract IUpdateVerifier{
        function verifyProof(
            uint[2] memory,
            uint[2][2] memory,
            uint[2] memory,
            uint[15] memory
        ) public view returns (bool){}
}

contract IWithdrawVerifier{
        function verifyProof(
            uint[2] memory,
            uint[2][2] memory,
            uint[2] memory,
            uint[3] memory
        ) public view returns (bool){}
}

contract Rollup{
    IPoseidonMerkle public poseidonMerkle;
    IUpdateVerifier public updateVerifier;
    IWithdrawVerifier public withdrawVerifier;
    IERC20 public tokenContract;

    uint256 public currentRoot;
    address public coordinator;
    uint256[] public pendingDeposits;
    uint256 public queueNumber;
    uint256 public depositSubtreeHeight;
    uint256 public updateNumber;

    uint256 public BAL_DEPTH = 4;
    uint256 public TX_DEPTH = 2;

    //---- MODIFIER ----

    mapping(uint256 => bool) public ethAddress;

    //------------------

    mapping(address => bool) public pendingTokens; // token address => approval status
    mapping(uint256 => address) public registeredTokens; // token number => token address *ETH doesnt have an address
    uint256 public numTokens; // number of approved tokens

    mapping(uint256 => uint256) public updates; // tx root => update index
    mapping(uint256 => bool) public processedWithdrawals; // withdraw message hash => bool

    event RegisteredToken(uint256 tokenType, address tokenContract);
    event RequestDeposit(uint256[2] pubKey, uint256 amount, uint256 tokenType);
    event UpdatedState(uint256 currentRoot, uint256 oldRoot, uint256 txRoot);
    event Withdraw(uint256[9] accountInfo, address recipient);

    constructor(address _poseidonMerkle,address _updateVerifier,address _withdrawVerifier) {
        poseidonMerkle = IPoseidonMerkle(_poseidonMerkle);
        updateVerifier = IUpdateVerifier(_updateVerifier);
        withdrawVerifier = IWithdrawVerifier(_withdrawVerifier);
        currentRoot = poseidonMerkle.zeroCache(BAL_DEPTH);

        coordinator = msg.sender;

        numTokens = 1; // Rollup starts supporting ETH by default

        queueNumber = 0;
        depositSubtreeHeight = 0;
        updateNumber = 0;
    }

    modifier onlyCoordinator() {
        assert(msg.sender == coordinator);
        _;
    }

    function updateState(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[15] memory input
    ) external onlyCoordinator {
        /* 
        input values - used for data availability to reconstruct the chain
        array.length = 3 (newRoot, txRoot, oldRoot) + 3 * 2 ** TX_DEPTH (the from_index, to_index and amount arrays)
        */
        // Can only update forward
        require(currentRoot == input[2]); // Input does not match current root
        // Validate proof
        require(updateVerifier.verifyProof(a, b, c, input)); // SNARK proof is invalid
        // Update merkle root
        currentRoot = input[0];
        updateNumber++;
        updates[input[1]] = updateNumber;
        emit UpdatedState(input[0], input[1], input[2]); //newRoot, txRoot, oldRoot
    }

    function deposit(
        uint256[2] memory pubkey,
        uint256 amount,
        uint256 tokenType
    ) external payable {
        require(
            !ethAddress[
                uint256(keccak256(abi.encodePacked(pubkey, tokenType)))
            ],
            "This address already exists"
        );
        if (tokenType == 0) {
            require(msg.sender == coordinator, "Reserved for coordinator");
            require(amount == 0 && msg.value == 0); // tokenType 0 does not have real value
        } else if (tokenType == 1) {
            require(
                msg.value > 0 && msg.value >= amount,
                "Insufficient amount"
            );
        } else if (tokenType > 1) {
            require(amount > 0, "Insufficient amount");
            address tokenContractAddress = registeredTokens[tokenType];
            tokenContract = IERC20(tokenContractAddress);
            require(
                tokenContract.transferFrom(msg.sender, address(this), amount),
                "Must approve token"
            );
        }

        ethAddress[
            uint256(keccak256(abi.encodePacked(pubkey, tokenType)))
        ] = true;

        uint256[] memory depositArray = new uint256[](5);
        depositArray[0] = pubkey[0];
        depositArray[1] = pubkey[1];
        depositArray[2] = amount;
        depositArray[3] = 0;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        depositArray[4] = tokenType;

        uint256 depositHash = poseidonMerkle.hashPoseidon(depositArray);
        pendingDeposits.push(depositHash);
        emit RequestDeposit(pubkey, amount, tokenType);
        queueNumber++;
        uint256 tmpDepositSubtreeHeight = 0;
        uint256 tmp = queueNumber;

        while (tmp % 2 == 0) {
            uint256[] memory array = new uint256[](2);
            array[0] = pendingDeposits[pendingDeposits.length - 2];
            array[1] = pendingDeposits[pendingDeposits.length - 1];
            pendingDeposits[pendingDeposits.length - 2] = poseidonMerkle
                .hashPoseidon(array);
            removeDeposit(pendingDeposits.length - 1);
            tmp = tmp / 2;
            tmpDepositSubtreeHeight++;
        }
        if (tmpDepositSubtreeHeight > depositSubtreeHeight) {
            depositSubtreeHeight = tmpDepositSubtreeHeight;
        }
    }

    function processDeposits(
        uint256 subtreeDepth,
        uint256[] memory subtreePosition,
        uint256[] memory subtreeProof
    ) external onlyCoordinator returns (uint256) {
        uint256 emptySubtreeRoot = poseidonMerkle.zeroCache(subtreeDepth); //empty subtree of height 2
        require(
            currentRoot ==
                poseidonMerkle.getRootFromProof(
                    emptySubtreeRoot,
                    subtreePosition,
                    subtreeProof
                )
        ); // Specified subtree is not empty
        currentRoot = poseidonMerkle.getRootFromProof(
            pendingDeposits[0],
            subtreePosition,
            subtreeProof
        );
        removeDeposit(0);
        queueNumber = queueNumber - 2**depositSubtreeHeight;
        return currentRoot;
    }

    function _verifyTx(
        uint256[9] memory txInfo //[pubkeyX, pubkeyY, index, toX ,toY, nonce, amount, token_type_from, txRoot]
    ) internal returns (uint256 txLeaf) {
        require(updates[txInfo[8]] > 0, "Transaction root does not exist");

        uint256[] memory txLeftSubleaf = new uint256[](4);
        txLeftSubleaf[0] = txInfo[0];
        txLeftSubleaf[1] = txInfo[1];
        txLeftSubleaf[2] = txInfo[3];
        txLeftSubleaf[3] = txInfo[4];
        uint256[] memory txRightSubleaf = new uint256[](4);
        txRightSubleaf[0] = txInfo[2];
        txRightSubleaf[1] = txInfo[5];
        txRightSubleaf[2] = txInfo[6];
        txRightSubleaf[3] = txInfo[7];

        uint256[] memory txSubTree = new uint256[](2);
        txSubTree[0] = poseidonMerkle.hashPoseidon(txLeftSubleaf);
        txSubTree[1] = poseidonMerkle.hashPoseidon(txRightSubleaf);

        txLeaf = poseidonMerkle.hashPoseidon(txSubTree);

        require(
            !processedWithdrawals[txLeaf],
            "Withdraw transaction already voided"
        );
        // Void the withdrawal hash
        processedWithdrawals[txLeaf] = true;
    }

    function withdraw(
        uint256[9] memory txInfo, //[pubkeyX, pubkeyY, index, toX ,toY, nonce, amount, token_type_from, txRoot]
        uint256[] memory position,
        uint256[] memory proof,
        address recipient,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c
    ) public {
        require(txInfo[7] > 0, "Invalid token type");

        uint256 txLeaf = _verifyTx(txInfo);

        require(
            txInfo[8] ==
                poseidonMerkle.getRootFromProof(txLeaf, position, proof),
            "Transaction does not exist in specified transaction root"
        );

        // message is hash of nonce and recipient address
        uint256[] memory msgArray = new uint256[](2);
        msgArray[0] = txInfo[5];
        msgArray[1] = uint256(uint160(recipient));

        require(
            withdrawVerifier.verifyProof(
                a,
                b,
                c,
                [txInfo[0], txInfo[1], poseidonMerkle.hashPoseidon(msgArray)]
            ),
            "EdDSA signature is not valid"
        );

        // Transfer the tokens
        if (txInfo[7] == 1) {
            // ETH
            payable(recipient).transfer(txInfo[6]);
        } else {
            // ERC20
            address tokenContractAddress = registeredTokens[txInfo[7]];
            tokenContract = IERC20(tokenContractAddress);
            require(
                tokenContract.transfer(recipient, txInfo[6]),
                "Transfer failed"
            );
        }

        emit Withdraw(txInfo, recipient);
    }

    function registerToken(address tokenContractAddress) external {
        require(
            !pendingTokens[tokenContractAddress],
            "Token already registered"
        );
        pendingTokens[tokenContractAddress] = true;
    }

    function approveToken(address tokenContractAddress)
        external
        onlyCoordinator
    {
        require(pendingTokens[tokenContractAddress]); // Token was not registered
        numTokens++;
        registeredTokens[numTokens] = tokenContractAddress;
        emit RegisteredToken(numTokens, tokenContractAddress);
    }

    function setcurrentRoot(uint256 Root) public onlyCoordinator{
        currentRoot = Root;
    }

    // helper functions
    function removeDeposit(uint256 index) internal returns (uint256[] memory) {
        require(index < pendingDeposits.length); // Index is out of bounds

        for (uint256 i = index; i < pendingDeposits.length - 1; i++) {
            pendingDeposits[i] = pendingDeposits[i + 1];
        }
        pendingDeposits.pop();
        return pendingDeposits;
    }
}
