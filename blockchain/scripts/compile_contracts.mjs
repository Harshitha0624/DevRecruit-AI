import fs from "fs";
import path from "path";
import solc from "solc";


const contractsDir = path.resolve(
    "smart-contracts"
);

const outputDir = path.resolve(
    "artifacts-local"
);

fs.mkdirSync(outputDir, {
    recursive: true
});


const files = fs.readdirSync(
    contractsDir
).filter(
    file => file.endsWith(".sol")
);


const sources = {};

for (const file of files) {

    const filePath = path.join(
        contractsDir,
        file
    );

    const stats = fs.statSync(
        filePath
    );

    // Skip empty scaffold files
    if (stats.size === 0) {
        continue;
    }

    sources[file] = {
        content: fs.readFileSync(
            filePath,
            "utf8"
        )
    };
}


if (Object.keys(sources).length === 0) {
    throw new Error(
        "No non-empty Solidity contracts found."
    );
}


const input = {
    language: "Solidity",

    sources: sources,

    settings: {
        optimizer: {
            enabled: true,
            runs: 200
        },

        outputSelection: {
            "*": {
                "*": [
                    "abi",
                    "evm.bytecode",
                    "evm.deployedBytecode"
                ]
            }
        }
    }
};


const output = JSON.parse(
    solc.compile(
        JSON.stringify(input)
    )
);


if (output.errors) {

    const errors = output.errors.filter(
        error => error.severity === "error"
    );

    if (errors.length > 0) {
        console.error(
            errors
        );

        process.exit(1);
    }

    const warnings = output.errors.filter(
        error => error.severity === "warning"
    );

    if (warnings.length > 0) {
        console.warn(
            warnings
        );
    }
}


let compiledCount = 0;


for (const sourceName of Object.keys(
    output.contracts
)) {

    const contracts =
        output.contracts[sourceName];

    for (const contractName of Object.keys(
        contracts
    )) {

        const contract =
            contracts[contractName];

        const artifact = {
            contractName: contractName,

            sourceName: sourceName,

            abi: contract.abi,

            bytecode:
                contract.evm.bytecode.object,

            deployedBytecode:
                contract.evm.deployedBytecode.object
        };

        const artifactPath = path.join(
            outputDir,
            `${contractName}.json`
        );

        fs.writeFileSync(
            artifactPath,
            JSON.stringify(
                artifact,
                null,
                2
            )
        );

        console.log(
            `${contractName} compiled successfully.`
        );

        console.log(
            `Artifact: artifacts-local/${contractName}.json`
        );

        compiledCount++;
    }
}


console.log(
    `\nTotal contracts compiled: ${compiledCount}`
);