// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AccessControl {

    address public owner;

    mapping(address => bool) public admins;
    mapping(address => bool) public recruiters;

    event AdminAdded(address indexed account);
    event AdminRemoved(address indexed account);

    event RecruiterAdded(address indexed account);
    event RecruiterRemoved(address indexed account);

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only owner"
        );
        _;
    }

    modifier onlyAdmin() {
        require(
            admins[msg.sender] || msg.sender == owner,
            "Only admin"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
    }

    function addAdmin(
        address account
    ) external onlyOwner {

        require(
            account != address(0),
            "Invalid address"
        );

        admins[account] = true;

        emit AdminAdded(account);
    }

    function removeAdmin(
        address account
    ) external onlyOwner {

        admins[account] = false;

        emit AdminRemoved(account);
    }

    function addRecruiter(
        address account
    ) external onlyAdmin {

        require(
            account != address(0),
            "Invalid address"
        );

        recruiters[account] = true;

        emit RecruiterAdded(account);
    }

    function removeRecruiter(
        address account
    ) external onlyAdmin {

        recruiters[account] = false;

        emit RecruiterRemoved(account);
    }

    function isAdmin(
        address account
    ) external view returns (bool) {
        return admins[account];
    }

    function isRecruiter(
        address account
    ) external view returns (bool) {
        return recruiters[account];
    }
}