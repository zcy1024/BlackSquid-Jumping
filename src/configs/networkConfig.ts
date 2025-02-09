import {getFullnodeUrl, SuiClient} from "@mysten/sui/client";
import {createNetworkConfig} from "@mysten/dapp-kit";
import {Transaction} from "@mysten/sui/transactions";

const network = "mainnet";

const {networkConfig, useNetworkVariable, useNetworkVariables} = createNetworkConfig({
    mainnet: {
        url: getFullnodeUrl("mainnet"),
        variables: {
            PackageID: "0xab28f392b8fbecdde704022ee526691c9f34c9a960ddc9cfe2f9326abcc30a12",
            UpgradeCap: "0x40c42f82f33775cdef6e3915fc7d5e5ba929dd981e0a185f5ded2f43e9c119b1",
            Publisher: "0xe1c461b301bee9d91ebe573dda964b9b734ec59c75295e441248378e9c274ad6",
            MintedVecSet: "0x863aaa90119a45f3cf524863200db16bcd54a091bd9c8c383dad78b93bb84266",
            Pool: "0xf105604d16fd80f10f37c97432e285457b508e7817b5f5d942c1f1ea606c89d7"
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