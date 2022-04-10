// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./Ownable.sol";
import "./SafeMath.sol";
using SafeMath for uint256;

contract DGLDonation is Ownable {
    uint pointRate = 1e9; // 1 point = 1 Gwei
    mapping (address => uint) public userToPoints;

    event newDonation(address _donator, string _message, uint _amount, uint timestamp);

    struct Donation {
        uint id;
        address owner;
        string message;
        uint amount;
        uint timestamp;
    }
    Donation[] public donations;

    struct WithdrawRecord {
        uint id;
        string message;
        uint amount;
        uint timestamp;
    }
    WithdrawRecord[] public withdrawRecords;

    mapping (uint => uint) donationIdToIndex; // Keep track of "donations" indexes
    mapping (uint => uint) withdrawIdToIndex; // Keep track of "withdrawRecords" indexes


    // Send money to the contract with a message
    function donate(string calldata _message) external payable returns (uint, uint) {
        // Initialize fields of "Donation"
        // Random a number
        uint randomId = randomNumber(msg.sender, _message);
        address owner = msg.sender;
        uint amount = msg.value;
        uint timestamp = block.timestamp; // unix timestamp of the latest block.

        // Push to donations array
        Donation memory doration = Donation(randomId, owner, _message, amount, timestamp);
        donations.push(doration);
        donationIdToIndex[randomId] = donations.length - 1;

        // Convert to point
        if (msg.value >= pointRate) {
            userToPoints[msg.sender] = msg.value.div(pointRate);
        }

        emit newDonation(msg.sender, _message, amount, timestamp);
        return (randomId, userToPoints[msg.sender]);
    }

    // Random a number with address and message
    function randomNumber(address _ownerAddress, string memory _message) internal view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, _ownerAddress, _message)));
    }

    // Get the user's point
    function checkPoints() external view returns (uint) {
        return userToPoints[msg.sender];
    }
    
    // Withdraw money from the owner
    function withdraw(uint _amount, string calldata _message) external onlyOwner{
        // Check if the balance is sufficient
        require(_amount <= address(this).balance);

        // Random a number
        uint randomId = randomNumber(msg.sender, _message);
        uint timestamp = block.timestamp; // unix timestamp of the latest block.


        // Record the withdraw
        WithdrawRecord memory withdrawRecord = WithdrawRecord(randomId, _message, _amount, timestamp);
        withdrawRecords.push(withdrawRecord);
        withdrawIdToIndex[randomId] = withdrawRecords.length - 1;

        payable(msg.sender).transfer(_amount);
    }

    // Get the total values
    function totalDonation() public view returns (uint) {
        return address(this).balance;
    }
}