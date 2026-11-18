import { defineConfig } from "hardhat/config";

export default defineConfig({
    solidity: "0.8.20",

    paths: {
        sources: "./smart-contracts",
        artifacts: "./artifacts",
        cache: "./cache"
    }
});