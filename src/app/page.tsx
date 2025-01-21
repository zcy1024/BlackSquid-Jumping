'use client'

import {useMediaSize} from "@/hooks";
import {useContext, useEffect, useState} from "react";
import Image from "next/image";
import {CustomConnectButton, DropdownMenu, MenuItemType} from "@/components";
import {WalletContext} from "@/contexts";
import {useDisconnectWallet, useSwitchAccount} from "@mysten/dapp-kit";
import {WalletAccount} from "@mysten/wallet-standard";

export default function Home() {
    const [windowWidth, windowHeight] = useMediaSize();
    const [blocks, setBlocks] = useState<void[]>([]);
    useEffect(() => {
        const nums = Math.ceil(windowWidth / 126) * Math.ceil(windowHeight / 126);
        setBlocks(Array.from<void>({length: nums}));
    }, [windowWidth, windowHeight]);

    const [opening, setOpening] = useState<boolean>(true);
    useEffect(() => {
        const delay = async (ms: number) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        delay(3000).then(() => setOpening(false));
    }, []);

    const {mutate: switchAccount} = useSwitchAccount();
    const {mutate: disconnect} = useDisconnectWallet();
    const walletContext = useContext(WalletContext);
    const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
    useEffect(() => {
        if (!walletContext.walletAddress) {
            setMenuItems([]);
            return;
        }
        const display = (account: WalletAccount) => {
            const splitName = (name: string | undefined) => {
                if (!name)
                    return "Connect";
                return name.slice(0, 6) + "..." + name.slice(-4);
            }
            if (account.label)
                return account.label.length <= 13 ? account.label : splitName(account.label);
            return splitName(account.address);
        }
        setMenuItems((walletContext.accounts.filter(account => account.address !== walletContext.walletAddress).map(account => {
            return {
                label: display(account),
                handleClick: () => switchAccount({account})
            }
        })).concat({
            label: "Disconnect",
            handleClick: disconnect
        }));
    }, [walletContext, switchAccount, disconnect]);

    return (
        <div className="w-screen h-screen overflow-hidden">
            <div className="fixed w-full h-full -z-10">
                <div className="flex justify-center items-center absolute w-full h-full animate-fivePoints">
                    <div className="w-[100vh] h-[100vh] rounded-full bg-blue-400 animate-circleEasyIn"></div>
                </div>
            </div>
            <div className="flex justify-between items-center h-16 px-64 bg-[#222]">
                <Image src="/logo.jpeg" alt="HOH" width={60} height={60} className="opacity-60" priority={true}/>
                <DropdownMenu props={menuItems}>
                    <CustomConnectButton/>
                </DropdownMenu>
            </div>
            <div className="flex flex-wrap justify-between">
                {
                    blocks.map((_, i) => <div className="h-[126px] w-[126px] bg-[#0A0A0A] mb-[1px]" key={i}></div>)
                }
            </div>
            {
                opening &&
                <div className="fixed top-0 left-0 w-full h-full z-10 bg-[#0A0A0A] opacity-80 animate-suiEasyOut">
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                        <Image src="/sui.png" alt="Sui" width={800} height={400} className="animate-rotateFlash"
                               priority={true}/>
                    </div>
                </div>
            }
        </div>
    );
}
