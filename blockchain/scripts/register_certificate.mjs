import fs from "fs";
import { ethers } from "ethers";

const RPC_URL = "http://127.0.0.1:8545";

const artifact = JSON.parse(
    fs.readFileSync(
        "./artifacts-local/CertificateVerification.json",
        "utf8"
    )
);

const deployment = JSON.parse(
    fs.readFileSync(
        "./artifacts-local/deployment.json",
        "utf8"
    )
);

const provider = new ethers.JsonRpcProvider(RPC_URL);

const signer = await provider.getSigner(0);

const contract = new ethers.Contract(
    deployment.contractAddress,
    artifact.abi,
    signer
);

const certificateId = "CERT-TEST-001";
const candidateId = 2;

const certificateHash =
    "9d5c20d7e7dfb82edaad3e825d5177ea1b95257f228117c970aacacbcbfee6d0";

const ipfsCid =
    "QmY1wrLmE7fJmXWDy21SQth7BLxgV4KjkP28edyQTVZNWu";

const issuer = "DevRecruit Test Issuer";

console.log("\nREGISTERING CERTIFICATE");
console.log("=======================");
console.log("Certificate ID:", certificateId);
console.log("Candidate ID:", candidateId);
console.log("SHA-256:", certificateHash);
console.log("IPFS CID:", ipfsCid);
console.log("Issuer:", issuer);

const tx = await contract.registerCertificate(
    certificateId,
    candidateId,
    certificateHash,
    ipfsCid,
    issuer
);

console.log("\nTransaction submitted:");
console.log(tx.hash);

const receipt = await tx.wait();

console.log("Transaction confirmed.");
console.log("Block number:", receipt.blockNumber);

const verification =
    await contract.verifyCertificate(
        certificateId,
        certificateHash
    );

console.log("\nBLOCKCHAIN VERIFICATION");
console.log("=======================");
console.log("Verified:", verification[0]);
console.log("IPFS CID:", verification[1]);
console.log("Issuer:", verification[2]);
console.log("Issued At:", verification[3].toString());

const record =
    await contract.getCertificate(
        certificateId
    );

console.log("\nCERTIFICATE RECORD");
console.log("==================");
console.log("Certificate ID:", record[0]);
console.log("Candidate ID:", record[1].toString());
console.log("Hash:", record[2]);
console.log("IPFS CID:", record[3]);
console.log("Issuer:", record[4]);
console.log("Active:", record[6]);