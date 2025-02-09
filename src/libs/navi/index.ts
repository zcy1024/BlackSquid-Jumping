'use server'

import {NAVX, getQuote as get} from "navi-sdk";
import {Dex} from "navi-sdk/dist/types";

export async function getQuote(from: string, to: string, amount: number) {
    return await get(NAVX.address, "0x2::sui::SUI", amount, "", {
        dexList: [Dex.BLUEFIN]
    });
}