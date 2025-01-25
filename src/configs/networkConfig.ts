import {getFullnodeUrl, SuiClient} from "@mysten/sui/client";
import {createNetworkConfig} from "@mysten/dapp-kit";
import {Transaction} from "@mysten/sui/transactions";

const network = "testnet";

const {networkConfig, useNetworkVariable, useNetworkVariables} = createNetworkConfig({
    testnet: {
        url: getFullnodeUrl("testnet"),
        variables: {
            PackageID: "0x19f11be12cb1e2d7716a8fc2572d5c26dca0e7528e646ead7f0406a589b84e11",
            UpgradeCap: "0x84df3af236a5c7f5d2def0636412df604d1ed6e5359578caed6383ea2a0412e7",
            Publisher: "0x07e39f01163b37acb07216e74353ab54f829406d3f009ebed79b7b367f58d09d",
            MintedVecSet: "0xbb4ac9bb358fe09db6ae26dfda949b92e51d618aec2a0427671060cd21cc166d",
            Pool: "0xea69106f92f4b241557267d003d4b7de65fb82462e093ed562210069a37c66d5"
        }
    }
});

const suiClient = new SuiClient({
    url: networkConfig[network].url
});

type NetworkVariables = ReturnType<typeof useNetworkVariables>;

function getNetworkVariables() {
    return networkConfig[network].variables;
}

function createBetterTxFactory<T extends Record<string, unknown>>(
    fn: (tx: Transaction, networkVariables: NetworkVariables, params: T) => Transaction
) {
    return (params: T) => {
        const tx = new Transaction();
        const networkVariables = getNetworkVariables();
        return fn(tx, networkVariables, params);
    }
}

export type {NetworkVariables};
export {
    network,
    useNetworkVariable,
    useNetworkVariables,
    networkConfig,
    suiClient,
    createBetterTxFactory
}