// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateVerification {

    struct Certificate {
        string certificateId;
        uint256 candidateId;
        string certificateHash;
        string ipfsCid;
        string issuer;
        uint256 issuedAt;
        bool active;
    }

    mapping(string => Certificate) private certificates;

    event CertificateRegistered(
        string certificateId,
        uint256 candidateId,
        string certificateHash,
        string ipfsCid,
        string issuer,
        uint256 issuedAt
    );

    event CertificateStatusChanged(
        string certificateId,
        bool active
    );

    function registerCertificate(
        string calldata certificateId,
        uint256 candidateId,
        string calldata certificateHash,
        string calldata ipfsCid,
        string calldata issuer
    ) external {

        require(
            bytes(certificateId).length > 0,
            "Certificate ID is required"
        );

        require(
            bytes(certificateHash).length > 0,
            "Certificate hash is required"
        );

        require(
            bytes(ipfsCid).length > 0,
            "IPFS CID is required"
        );

        require(
            bytes(certificates[certificateId].certificateId).length == 0,
            "Certificate already exists"
        );

        certificates[certificateId] = Certificate({
            certificateId: certificateId,
            candidateId: candidateId,
            certificateHash: certificateHash,
            ipfsCid: ipfsCid,
            issuer: issuer,
            issuedAt: block.timestamp,
            active: true
        });

        emit CertificateRegistered(
            certificateId,
            candidateId,
            certificateHash,
            ipfsCid,
            issuer,
            block.timestamp
        );
    }

    function verifyCertificate(
        string calldata certificateId,
        string calldata certificateHash
    )
        external
        view
        returns (
            bool verified,
            string memory ipfsCid,
            string memory issuer,
            uint256 issuedAt
        )
    {
        Certificate memory certificate =
            certificates[certificateId];

        if (
            bytes(certificate.certificateId).length == 0 ||
            !certificate.active
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
                bytes(certificate.certificateHash)
            )
            ==
            keccak256(
                bytes(certificateHash)
            );

        return (
            hashMatches,
            certificate.ipfsCid,
            certificate.issuer,
            certificate.issuedAt
        );
    }

    function getCertificate(
        string calldata certificateId
    )
        external
        view
        returns (
            string memory,
            uint256,
            string memory,
            string memory,
            string memory,
            uint256,
            bool
        )
    {
        Certificate memory certificate =
            certificates[certificateId];

        require(
            bytes(certificate.certificateId).length > 0,
            "Certificate not found"
        );

        return (
            certificate.certificateId,
            certificate.candidateId,
            certificate.certificateHash,
            certificate.ipfsCid,
            certificate.issuer,
            certificate.issuedAt,
            certificate.active
        );
    }

    function deactivateCertificate(
        string calldata certificateId
    ) external {

        require(
            bytes(certificates[certificateId].certificateId).length > 0,
            "Certificate not found"
        );

        certificates[certificateId].active = false;

        emit CertificateStatusChanged(
            certificateId,
            false
        );
    }
}