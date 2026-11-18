import fs from "fs";
import { ethers } from "ethers";

const RPC_URL = "http://127.0.0.1:8545";

const artifactPath =
    "./artifacts-local/CertificateVerification.json";

const artifact = JSON.parse(
    fs.readFileSync(artifactPath, "utf8")
);

const provider = new ethers.JsonRpcProvider(RPC_URL);

const signer = await provider.getSigner(0);

const deployerAddress = await signer.getAddress();

const balance = await provider.getBalance(
    deployerAddress
);

console.log("DEPLOYER");
console.log("========");
console.log("Address:", deployerAddress);
console.log(
    "Balance:",
    ethers.formatEther(balance),
    "ETH"
);

const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    signer
);

console.log("\nDeploying CertificateVerification...");

const contract = await factory.deploy();

await contract.waitForDeployment();

const contractAddress =
    await contract.getAddress();

console.log("\nCONTRACT DEPLOYED");
console.log("=================");
console.log(
    "CertificateVerification:",
    contractAddress
);

const deploymentInfo = {
    contractName: "CertificateVerification",
    network: "hardhat-local",
    rpcUrl: RPC_URL,
    deployer: deployerAddress,
    contractAddress: contractAddress
};

fs.writeFileSync(
    "./artifacts-local/deployment.json",
    JSON.stringify(
        deploymentInfo,
        null,
        2
    )
);

console.log(
    "\nSaved: artifacts-local/deployment.json"
);