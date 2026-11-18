import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import crypto from "crypto";

const RPC_URL = "http://127.0.0.1:8545";

const envPath = path.resolve("../backend/.env");
const artifactPath = path.resolve(
    "artifacts-local/RecruiterVerification.json"
);
const deploymentPath = path.resolve(
    "artifacts-local/recruiter_deployment.json"
);

function loadEnvValue(name) {
    const content = fs.readFileSync(envPath, "utf8");
    const match = content.match(
        new RegExp("^" + name + "=(.+)$", "m")
    );

    if (!match) {
        throw new Error(
            `${name} not found in backend/.env`
        );
    }

    return match[1].trim();
}

function generateCompanyHash(
    companyName,
    registrationId,
    email
) {
    const data =
        `${companyName.trim().toLowerCase()}|` +
        `${registrationId.trim().toLowerCase()}|` +
        `${email.trim().toLowerCase()}`;

    return crypto
        .createHash("sha256")
        .update(data, "utf8")
        .digest("hex");
}

const privateKey = loadEnvValue(
    "BLOCKCHAIN_PRIVATE_KEY"
);

const artifact = JSON.parse(
    fs.readFileSync(
        artifactPath,
        "utf8"
    )
);

const deployment = JSON.parse(
    fs.readFileSync(
        deploymentPath,
        "utf8"
    )
);

const provider = new ethers.JsonRpcProvider(
    RPC_URL
);

const wallet = new ethers.Wallet(
    privateKey,
    provider
);

const contract = new ethers.Contract(
    deployment.address,
    artifact.abi,
    wallet
);

const recruiterId = 1;
const companyName = "DevRecruit Technologies";
const registrationId = "DR-001";
const email = "hr@devrecruit.com";

const companyHash = generateCompanyHash(
    companyName,
    registrationId,
    email
);

console.log("Recruiter ID:", recruiterId);
console.log("Company:", companyName);
console.log(
    "Registration ID:",
    registrationId
);
console.log("Email:", email);
console.log(
    "Company Hash:",
    companyHash
);

console.log(
    "Registering recruiter on blockchain..."
);

const tx = await contract.registerRecruiter(
    recruiterId,
    companyName,
    registrationId,
    companyHash
);

console.log(
    "Transaction:",
    tx.hash
);

const receipt = await tx.wait();

console.log(
    "Recruiter registered successfully."
);

console.log(
    "Block:",
    receipt.blockNumber
);

const record = await contract.getRecruiter(
    recruiterId
);

console.log(
    "On-chain recruiter record:"
);

console.log(record);

console.log(
    "Verifying recruiter..."
);

const verification =
    await contract.verifyRecruiter(
        recruiterId,
        companyHash
    );

console.log(
    "Verification result:",
    verification
);

console.log(
    "Verified:",
    verification[0]
);