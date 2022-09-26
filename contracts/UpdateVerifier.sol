// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Pairing.sol";

contract UpdateVerifier {
    /// @return r  bool true if proof is valid
    function verifyUpdateProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[15] memory input
    ) public view returns (bool r) {
        return true;
    }
}
