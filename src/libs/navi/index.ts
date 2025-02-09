'use server'

import {getQuote as get} from "navi-sdk";
import {Dex} from "navi-sdk/dist/types";

export async function getQuote(from: string, to: string, amount: number) {
    return await get(from, to, amount, "", {
        dexList: [Dex.BLUEFIN]
    });
}