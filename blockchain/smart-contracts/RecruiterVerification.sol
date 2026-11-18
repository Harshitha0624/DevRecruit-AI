// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RecruiterVerification {

    struct Recruiter {
        uint256 recruiterId;
        string companyName;
        string registrationId;
        string companyHash;
        bool verified;
        uint256 verifiedAt;
        bool active;
    }

    mapping(uint256 => Recruiter) private recruiters;

    event RecruiterVerified(
        uint256 recruiterId,
        string companyName,
        string registrationId,
        string companyHash,
        uint256 verifiedAt
    );

    event RecruiterDeactivated(
        uint256 recruiterId
    );

    function registerRecruiter(
        uint256 recruiterId,
        string calldata companyName,
        string calldata registrationId,
        string calldata companyHash
    ) external {

        require(
            recruiterId > 0,
            "Invalid recruiter ID"
        );

        require(
            bytes(companyName).length > 0,
            "Company name is required"
        );

        require(
            bytes(registrationId).length > 0,
            "Registration ID is required"
        );

        require(
            bytes(companyHash).length > 0,
            "Company hash is required"
        );

        require(
            !recruiters[recruiterId].verified,
            "Recruiter already verified"
        );

        recruiters[recruiterId] = Recruiter({
            recruiterId: recruiterId,
            companyName: companyName,
            registrationId: registrationId,
            companyHash: companyHash,
            verified: true,
            verifiedAt: block.timestamp,
            active: true
        });

        emit RecruiterVerified(
            recruiterId,
            companyName,
            registrationId,
            companyHash,
            block.timestamp
        );
    }

    function verifyRecruiter(
        uint256 recruiterId,
        string calldata companyHash
    )
        external
        view
        returns (
            bool verified,
            string memory companyName,
            string memory registrationId,
            uint256 verifiedAt
        )
    {
        Recruiter memory recruiter =
            recruiters[recruiterId];

        if (
            !recruiter.verified ||
            !recruiter.active
        ) {
            return (
                false,
                "",
                "",
                0
            );
        }

        bool hashMatches =
            keccak256(
                bytes(recruiter.companyHash)
            )
            ==
            keccak256(
                bytes(companyHash)
            );

        return (
            hashMatches,
            recruiter.companyName,
            recruiter.registrationId,
            recruiter.verifiedAt
        );
    }

    function getRecruiter(
        uint256 recruiterId
    )
        external
        view
        returns (
            uint256,
            string memory,
            string memory,
            string memory,
            bool,
            uint256,
            bool
        )
    {
        Recruiter memory recruiter =
            recruiters[recruiterId];

        require(
            recruiter.recruiterId > 0,
            "Recruiter not found"
        );

        return (
            recruiter.recruiterId,
            recruiter.companyName,
            recruiter.registrationId,
            recruiter.companyHash,
            recruiter.verified,
            recruiter.verifiedAt,
            recruiter.active
        );
    }

    function deactivateRecruiter(
        uint256 recruiterId
    ) external {

        require(
            recruiters[recruiterId].recruiterId > 0,
            "Recruiter not found"
        );

        recruiters[recruiterId].active = false;

        emit RecruiterDeactivated(
            recruiterId
        );
    }
}