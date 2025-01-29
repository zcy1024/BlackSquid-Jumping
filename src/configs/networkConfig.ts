import {getFullnodeUrl, SuiClient} from "@mysten/sui/client";
import {createNetworkConfig} from "@mysten/dapp-kit";
import {Transaction} from "@mysten/sui/transactions";

const network = "testnet";

const {networkConfig, useNetworkVariable, useNetworkVariables} = createNetworkConfig({
    testnet: {
        url: getFullnodeUrl("testnet"),
        variables: {
            PackageID: "0x93ccecbea33631e915d3bdd852c35711b38119662c999a3fec646c2b3515a13b",
            UpgradeCap: "0x7ad0819bdcf86841dea9f072c4d5e8b53e01b666d3092d21aaf152eac49e7de3",
            Publisher: "0x5aef46633a5a9e2ec4e5d85899a385a825f8cbadf8a12ca10aaf5e114d070eff",
            MintedVecSet: "0x102bdbfbce245721bc4c4f81633f4c2866b570213183ef4955a4253b1aac71fd",
            Pool: "0x610f592becd24a1fa2303e69fa237b9158002f886a499d2446084f6f2939fc59"
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