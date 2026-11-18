// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SkillBadge {

    struct Badge {
        uint256 badgeId;
        uint256 candidateId;
        string skill;
        uint256 score;
        string badgeHash;
        uint256 issuedAt;
        bool active;
    }

    mapping(uint256 => Badge) private badges;

    event BadgeIssued(
        uint256 badgeId,
        uint256 candidateId,
        string skill,
        uint256 score,
        string badgeHash,
        uint256 issuedAt
    );

    event BadgeDeactivated(
        uint256 badgeId
    );

    function issueBadge(
        uint256 badgeId,
        uint256 candidateId,
        string calldata skill,
        uint256 score,
        string calldata badgeHash
    ) external {

        require(
            badgeId > 0,
            "Invalid badge ID"
        );

        require(
            candidateId > 0,
            "Invalid candidate ID"
        );

        require(
            bytes(skill).length > 0,
            "Skill is required"
        );

        require(
            bytes(badgeHash).length > 0,
            "Badge hash is required"
        );

        require(
            badges[badgeId].badgeId == 0,
            "Badge already exists"
        );

        badges[badgeId] = Badge({
            badgeId: badgeId,
            candidateId: candidateId,
            skill: skill,
            score: score,
            badgeHash: badgeHash,
            issuedAt: block.timestamp,
            active: true
        });

        emit BadgeIssued(
            badgeId,
            candidateId,
            skill,
            score,
            badgeHash,
            block.timestamp
        );
    }

    function verifyBadge(
        uint256 badgeId,
        string calldata badgeHash
    )
        external
        view
        returns (
            bool verified,
            uint256 candidateId,
            string memory skill,
            uint256 score,
            uint256 issuedAt
        )
    {
        Badge memory badge = badges[badgeId];

        if (badge.badgeId == 0) {
            return (
                false,
                0,
                "",
                0,
                0
            );
        }

        bool hashMatches =
            keccak256(bytes(badge.badgeHash))
            ==
            keccak256(bytes(badgeHash));

        return (
            hashMatches && badge.active,
            badge.candidateId,
            badge.skill,
            badge.score,
            badge.issuedAt
        );
    }

    function getBadge(
        uint256 badgeId
    )
        external
        view
        returns (
            uint256,
            uint256,
            string memory,
            uint256,
            string memory,
            uint256,
            bool
        )
    {
        Badge memory badge = badges[badgeId];

        return (
            badge.badgeId,
            badge.candidateId,
            badge.skill,
            badge.score,
            badge.badgeHash,
            badge.issuedAt,
            badge.active
        );
    }

    function deactivateBadge(
        uint256 badgeId
    ) external {

        require(
            badges[badgeId].badgeId > 0,
            "Badge does not exist"
        );

        badges[badgeId].active = false;

        emit BadgeDeactivated(badgeId);
    }
}