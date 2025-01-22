'use client'

import {useEffect, useState} from "react";
import {Player} from "@/components/index";

export default function PlayArea() {
    const [gaming, setGaming] = useState<boolean>(false);
    const [platforms, setPlatforms] = useState<void[]>([]);
    const [playerIdx, setPlayerIdx] = useState<[number, number]>([0, 0]);

    const handleStartOrOver = () => {
        if (gaming) {
            setPlayerIdx([0, 0]);
        }

        setGaming(!gaming);
    }

    useEffect(() => {
        const PlatformNums = 6;
        const delay = async (ms: number) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        const addPlatforms = async () => {
            for (let i = 0; i < PlatformNums; i++) {
                setPlatforms(Array.from<void>({length: i + 1}));
                await delay(200);
            }
        }
        addPlatforms().then();
    }, []);

    const handleClick = (list: number, row: number) => {
        setPlayerIdx([list + 1, row]);
    }

    return (
        <div className="flex flex-col justify-between items-center h-full p-28 opacity-60">
            <div className="relative top-[6%] flex items-center gap-10 animate-[easyIn_12s_ease-in-out_forwards]">
                <div
                    className={"relative h-[126px] w-[126px] bg-[#1A1A1A] rounded-full border-double border-2 animate-borderColor transition-all duration-1000 " + (playerIdx[0] === 0 ? "" : "bg-black")}>
                    <Player areaIndex={[0, 0]} playerIndex={playerIdx}/>
                </div>
                {
                    platforms.map((_, index) =>
                        <div key={index} className="flex flex-col gap-10 animate-[easyIn_6s_ease-in-out_forwards]">
                            {
                                Array.from<void>({length: 3}).map((_, innerIndex) =>
                                    <button key={innerIndex}
                                            className={"relative h-[126px] w-[126px] rounded-full border-double border-2 animate-borderColor transition-all duration-1000 " + (playerIdx[0] === index || playerIdx[0] - 1 === index && playerIdx[1] === innerIndex ? "bg-[#1A1A1A]" : "bg-black")}
                                            disabled={playerIdx[0] !== index || !gaming}
                                            onClick={() => handleClick(index, innerIndex)}>
                                        <Player areaIndex={[index + 1, innerIndex]} playerIndex={playerIdx}/>
                                    </button>)
                            }
                        </div>
                    )
                }
            </div>
            <div className="flex gap-36 items-center">
                <div>{!gaming ? "Ticket: 1Sui" : "Award: 0.9Sui"}</div>
                <div
                    className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 cursor-pointer p-1 rounded-full animate-pulse"
                    onClick={handleStartOrOver}>
                    {!gaming ? "Start Game" : "End Game"}
                </div>
            </div>
        </div>
    )
}