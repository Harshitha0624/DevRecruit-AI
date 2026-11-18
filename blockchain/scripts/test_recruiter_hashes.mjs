import fs from "fs";
import path from "path";
import { ethers } from "ethers";

const RPC_URL = "http://127.0.0.1:8545";

const envPath = path.resolve("../backend/.env");
const artifactPath = path.resolve("artifacts-local/RecruiterVerification.json");
const deploymentPath = path.resolve("artifacts-local/recruiter_deployment.json");

function loadEnvValue(name) {
    const content = fs.readFileSync(envPath, "utf8");
    const match = content.match(new RegExp("^" + name + "=(.+)$", "m"));

    if (!match) {
        throw new Error(`${name} not found in backend/.env`);
    }

    return match[1].trim();
}

const privateKey = loadEnvValue("BLOCKCHAIN_PRIVATE_KEY");

const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(
    deployment.address,
    artifact.abi,
    wallet
);

const recruiterId = 1;
const companyName = "DevRecruit Technologies";
const registrationId = "DR-001";
const email = "hr@devrecruit.com";

const values = {
    sha256_pipe:
        ethers.sha256(
            ethers.toUtf8Bytes(
                `${companyName}|${registrationId}|${email}`
            )
        ),

    sha256_no_separator:
        ethers.sha256(
            ethers.toUtf8Bytes(
                `${companyName}${registrationId}${email}`
            )
        ),

    keccak256_pipe:
        ethers.keccak256(
            ethers.toUtf8Bytes(
                `${companyName}|${registrationId}|${email}`
            )
        ),

    keccak256_no_separator:
        ethers.keccak256(
            ethers.toUtf8Bytes(
                `${companyName}${registrationId}${email}`
            )
        )
};

for (const [name, hash] of Object.entries(values)) {
    const result = await contract.verifyRecruiter(recruiterId, hash);

    console.log(`${name}: ${hash}`);
    console.log("Result:", result[0]);
    console.log("--------------------------------");
}
