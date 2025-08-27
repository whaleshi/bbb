import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams, useSearchParams } from "next/navigation";

import Top from "./Top";
import Trade from "./Trade";

const Details = () => {
    // 0x470336615E62Afd9CbfC3cB36d64E9fce639FFb9
    const router = useRouter();
    const params = useParams();
    const [tokenAddress, setTokenAddress] = useState<string>("");

    useEffect(() => {
        console.log(params.addr)
    }, [params]);

    return (
        <div className="w-full max-w-[450px] flex flex-col h-full">
            <div className="flex items-center justify-between relative pt-[16px]">
                <div onClick={() => router.push("/")} className="relative z-1 w-[40px] h-[40px] border border-[#F3F3F3] cursor-pointer flex items-center justify-center">
                    <BackIcon />
                </div>
                <div onClick={() => router.push("/")} className="relative z-1 w-[40px] h-[40px] border border-[#F3F3F3] cursor-pointer flex items-center justify-center">
                    <ShareIcon />
                </div>
            </div>
            <Top />
            <div className="flex-grow h-[100px]"></div>
            <Trade />
        </div>
    );
};

export default Details;

const BackIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
        <rect x="1.55029" y="0.843262" width="15" height="1" transform="rotate(45 1.55029 0.843262)" fill="#101010" />
        <rect x="11.4497" y="0.843262" width="1" height="15" transform="rotate(45 11.4497 0.843262)" fill="#101010" />
    </svg>
);

const ShareIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="14" viewBox="0 0 19 14" fill="none">
        <path d="M1.5 13.5H17.5" stroke="#101010" stroke-linecap="square" />
        <path d="M1.5 6.5V13.5" stroke="#101010" stroke-linecap="square" />
        <path d="M9.5 2.5V9.5" stroke="#101010" stroke-linecap="square" />
        <path d="M11.443 2.95342L9.5625 1.5L7.77026 2.95342" stroke="#101010" stroke-linecap="square" />
        <path d="M17.5 6.5V13.5" stroke="#101010" stroke-linecap="square" />
    </svg>
);