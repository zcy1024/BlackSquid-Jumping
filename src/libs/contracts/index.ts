import {createBetterTxFactory, networkConfig, suiClient} from "@/configs/networkConfig";
import {NFTContextType, PoolContextType} from "@/contexts";
import {SuiEvent} from "@mysten/sui/client";
import {run} from "@/libs/atoma";

export const startGameTx = createBetterTxFactory<{
    nft: string | undefined
    account: string
}>((tx, networkVariables, params) => {
    const nftObj = params.nft ? tx.object(params.nft) : tx.moveCall({
        package: networkVariables.PackageID,
        module: "nft",
        function: "mint",
        arguments: [
            tx.object(networkVariables.MintedVecSet)
        ]
    })[0];
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(1000000000)]);
    tx.moveCall({
        package: networkVariables.PackageID,
        module: "game",
        function: "start_game",
        arguments: [
            nftObj,
            tx.object(networkVariables.Pool),
            coin
        ]
    });
    if (!params.nft) {
        tx.moveCall({
            package: networkVariables.PackageID,
            module: "nft",
            function: "transfer",
            arguments: [
                tx.object(networkVariables.MintedVecSet),
                nftObj,
                tx.pure.address(params.account)
            ]
        });
    }
    return tx;
})

export const nextPositionTx = createBetterTxFactory<{
    list: number,
    row: number,
    nft: string
}>((tx, networkVariables, params) => {
    run().then(res => {
        console.log(res);
        console.log(res.choices[0].message.content);
    });
    tx.moveCall({
        package: networkVariables.PackageID,
        module: "game",
        function: "next_position",
        arguments: [
            tx.pure.u8(params.list),
            tx.pure.u8(params.row),
            tx.object("0x8"),
            tx.object(params.nft),
            tx.object(networkVariables.Pool)
        ]
    });
    return tx;
})

export const endGameTx = createBetterTxFactory<{
    nft: string
}>((tx, networkVariables, params) => {
    tx.moveCall({
        package: networkVariables.PackageID,
        module: "game",
        function: "end_game",
        arguments: [
            tx.object(params.nft),
            tx.object(networkVariables.Pool)
        ]
    });
    return tx;
})

export const investTx = createBetterTxFactory<{
    amount: number
}>((tx, networkVariables, params) => {
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(params.amount)]);
    tx.moveCall({
        package: networkVariables.PackageID,
        module: "pool",
        function: "invest",
        arguments: [
            tx.object(networkVariables.Pool),
            coin
        ]
    });
    return tx;
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const investWithdrawTx = createBetterTxFactory((tx, networkVariables, _) => {
    tx.moveCall({
        package: networkVariables.PackageID,
        module: "pool",
        function: "invest_withdraw",
        arguments: [
            tx.object(networkVariables.Pool)
        ]
    });
    return tx;
})

async function queryNFT(account: string, NFTType: string, cursor: string | null | undefined) {
    const res = await suiClient.getOwnedObjects({
        owner: account,
        cursor,
        options: {
            showType: true
        }
    });
    const found = res.data.find(obj => obj.data?.type === NFTType);
    if (found)
        return found;
    if (res.hasNextPage)
        return queryNFT(account, NFTType, res.nextCursor);
    return undefined;
}

export async function updateNFTInfo(account: string, nft: string | undefined): Promise<NFTContextType> {
    let NFT = nft;
    if (!NFT) {
        const res = await queryNFT(account, `${networkConfig.testnet.variables.PackageID}::nft::BlackSquidJumpingNFT`, null);
        if (!res) {
            return {
                nft: undefined,
                list: 0,
                row: 0,
                playing: false,
                award: 0
            }
        }
        NFT = res.data?.objectId;
    }
    const res = await suiClient.getObject({
        id: NFT!,
        options: {
            showContent: true
        }
    });
    const temp = res.data?.content as unknown as {
        fields: {
            list: string,
            row: string,
            playing: boolean,
            award: string
        }
    };
    return {
        nft: NFT,
        list: Number(temp.fields.list),
        row: Number(temp.fields.row),
        playing: temp.fields.playing,
        award: Number(temp.fields.award) / 1000000000
    }
}

export function handleEvent(event: SuiEvent | undefined): string {
    if (!event)
        return "";
    if (event.type === `${networkConfig.testnet.variables.PackageID}::pool::DisburseBonusEvent`) {
        const award = Number((event.parsedJson as {
            bonus: string
        }).bonus) / 1000000000;
        return `Award: ${award}Sui`;
    }
    if (event.type === `${networkConfig.testnet.variables.PackageID}::game::LoseEvent`) {
        const award = Number((event.parsedJson as {
            amount: string
        }).amount) / 1000000000;
        return `Miss: ${award}Sui`;
    }
    return "";
}

export async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function queryPoolInfo(account: string): Promise<PoolContextType> {
    const pool = await suiClient.getObject({
        id: networkConfig.testnet.variables.Pool,
        options: {
            showContent: true
        }
    });
    const data = (pool.data?.content as unknown as {
        fields: {
            balance: string,
            investor_map: {
                fields: {
                    contents: [{
                        fields: {
                            key: string,
                            value: string
                        }
                    }]
                }
            }
        }
    }).fields;
    const total = data.balance;
    const found = data.investor_map.fields.contents.find(investor => investor.fields.key === account);
    return {
        total: Number(total),
        invested_amount: found ? Number(found.fields.value) : 0
    }
}