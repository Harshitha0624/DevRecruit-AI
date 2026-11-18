import fs from "fs";
import path from "path";
import { ethers } from "ethers";

const RPC_URL = "http://127.0.0.1:8545";

const envPath = path.resolve("../backend/.env");
const artifactPath = path.resolve("artifacts-local/AccessControl.json");
const deploymentPath = path.resolve(
    "artifacts-local/access_control_deployment.json"
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

const accounts = await provider.listAccounts();

const owner = await contract.owner();
const recruiter = accounts[1].address;

console.log("Connected wallet:", wallet.address);
console.log("Contract owner:", owner);
console.log("Recruiter:", recruiter);

console.log(
    "Owner is admin:",
    await contract.isAdmin(owner)
);

console.log("Adding recruiter...");

const tx = await contract.addRecruiter(
    recruiter
);

await tx.wait();

console.log(
    "Recruiter added:",
    await contract.isRecruiter(recruiter)
);