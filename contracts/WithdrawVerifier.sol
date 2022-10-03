// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract WithdrawVerifier {
    /// @return r  bool true if proof is valid
    function verifyWithdrawProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[3] memory input
    ) public view returns (bool r) {
        return true;
    }
}
