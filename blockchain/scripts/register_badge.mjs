import fs from "fs";
import path from "path";
import crypto from "crypto";
import { ethers } from "ethers";

const RPC_URL = "http://127.0.0.1:8545";

const envPath = path.resolve("../backend/.env");
const artifactPath = path.resolve("artifacts-local/SkillBadge.json");
const deploymentPath = path.resolve(
    "artifacts-local/skill_badge_deployment.json"
);

function loadEnvValue(name) {
    const content = fs.readFileSync(envPath, "utf8");

    const match = content.match(
        new RegExp("^" + name + "=(.+)$", "m")
    );

    if (!match) {
        throw new Error(`${name} not found in backend/.env`);
    }

    return match[1].trim();
}

function generateBadgeHash(
    candidateId,
    skill,
    score
) {
    const data =
        `${Number(candidateId)}|` +
        `${skill.trim().toLowerCase()}|` +
        `${Number(score).toFixed(2)}`;

    return crypto
        .createHash("sha256")
        .update(data, "utf8")
        .digest("hex");
}

const privateKey = loadEnvValue(
    "BLOCKCHAIN_PRIVATE_KEY"
);

const artifact = JSON.parse(
    fs.readFileSync(artifactPath, "utf8")
);

const deployment = JSON.parse(
    fs.readFileSync(deploymentPath, "utf8")
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

const badgeId = 2;
const candidateId = 2;
const skill = "Python";
const score = 92;

const badgeHash = generateBadgeHash(
    candidateId,
    skill,
    score
);

console.log("Badge ID:", badgeId);
console.log("Candidate ID:", candidateId);
console.log("Skill:", skill);
console.log("Score:", score);
console.log("Badge Hash:", badgeHash);

console.log(
    "Registering skill badge on blockchain..."
);

const tx = await contract.issueBadge(
    badgeId,
    candidateId,
    skill,
    score,
    badgeHash
);

console.log(
    "Transaction:",
    tx.hash
);

const receipt = await tx.wait();

console.log(
    "Skill badge registered successfully."
);

console.log(
    "Block:",
    receipt.blockNumber
);

const record = await contract.getBadge(
    badgeId
);

console.log(
    "On-chain badge record:"
);

console.log(record);

console.log(
    "Verifying skill badge..."
);

const verification =
    await contract.verifyBadge(
        badgeId,
        badgeHash
    );

console.log(
    "Verification result:",
    verification
);

console.log(
    "Verified:",
    verification[0]
);
