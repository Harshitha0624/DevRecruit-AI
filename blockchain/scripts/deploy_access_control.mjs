import fs from "fs";
import path from "path";
import { ethers } from "ethers";

const RPC_URL = "http://127.0.0.1:8545";

const envPath = path.resolve("../backend/.env");
const artifactPath = path.resolve("artifacts-local/AccessControl.json");
const outputPath = path.resolve("artifacts-local/access_control_deployment.json");

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

const privateKey = loadEnvValue("BLOCKCHAIN_PRIVATE_KEY");

const artifact = JSON.parse(
    fs.readFileSync(artifactPath, "utf8")
);

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(privateKey, provider);

console.log("Connected to:", RPC_URL);
console.log("Deployer:", wallet.address);

const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
);

console.log("Deploying AccessControl...");

const contract = await factory.deploy();

await contract.waitForDeployment();

const address = await contract.getAddress();

console.log("AccessControl deployed successfully.");
console.log("Contract address:", address);

const deployment = {
    contract: "AccessControl",
    address: address,
    network: "Hardhat Local",
    rpc_url: RPC_URL,
    deployer: wallet.address,
    deployed_at: new Date().toISOString()
};

fs.writeFileSync(
    outputPath,
    JSON.stringify(deployment, null, 2)
);

console.log(
    "Deployment saved to:",
    outputPath
);
