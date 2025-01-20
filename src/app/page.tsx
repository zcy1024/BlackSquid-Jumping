'use client'

import {useMediaSize} from "@/hooks";
import {useEffect, useState} from "react";
import Image from "next/image";

export default function Home() {
    const [windowWidth, windowHeight] = useMediaSize();
    const [blocks, setBlocks] = useState<void[]>([]);
    useEffect(() => {
        const nums = Math.ceil(windowWidth / 126) * Math.ceil(windowHeight / 126);
        setBlocks(Array.from<void>({length: nums}));
    }, [windowWidth, windowHeight]);

    return (
        <div className="w-screen h-screen overflow-hidden">
            <div className="fixed w-full h-full -z-10">
                <div className="flex justify-center items-center absolute w-full h-full animate-fivePoints">
                    <div className="w-[100vh] h-[100vh] rounded-full bg-blue-400 animate-circleEasyIn"></div>
                </div>
            </div>
            <div className="h-16 bg-[#222]"></div>
            <div className="flex flex-wrap justify-between">
                {
                    blocks.map((_, i) => <div className="h-[126px] w-[126px] bg-[#0A0A0A] mb-[1px]" key={i}></div>)
                }
            </div>
            <div className="fixed top-0 left-0 w-full h-full z-10 bg-[#0A0A0A] opacity-80 animate-suiEasyOut">
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <Image src="/sui.png" alt="Sui" width={800} height={400} className="animate-rotateFlash" priority={true}/>
                </div>
            </div>
        </div>
    );
}
