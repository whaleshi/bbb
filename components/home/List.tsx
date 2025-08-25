"use client";

import React, { useState } from "react";
import { Pagination, Skeleton, Image } from "@heroui/react";
import _bignumber from "bignumber.js";
import { formatBigNumber } from "@/utils/formatBigNumber";

import TokenListWithQuery from '@/components/graph/TokenListWithQuery'


import { useRouter } from "next/navigation";
import { useTokens } from '@/hooks/useTokens'

const List = () => {
    const router = useRouter();
    const [active, setActive] = useState(0);
    const { data: tokens, isLoading, error } = useTokens({ first: 10 })

    const tabs = [
        { id: 0, label: "新创建" },
        { id: 1, label: "飙升" },
        { id: 2, label: "新开盘" },
        { id: 3, label: "热门" }
    ];

    const [showSkeleton, setShowSkeleton] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const setHomeListPage = () => { };

    return (
        <div className="w-full max-w-[450px] pt-[32px] mx-auto">
            <div className="h-[54px] w-full flex items-center justify-between relative ">
                <div className="flex gap-[24px] text-[16px]">
                    {tabs.map((tab) => (
                        <div
                            key={tab.id}
                            className={
                                active === tab.id
                                    ? "text-[#101010] cursor-pointer"
                                    : "cursor-pointer text-[#999]"
                            }
                            onClick={() => setActive(tab.id)}
                        >
                            {tab.label}
                        </div>
                    ))}
                </div>
                <div
                    className="h-[32px] px-[12px] flex items-center gap-[4px] cursor-pointer border-[#F3F3F3] border text-[#101010] text-[13px]"
                    onClick={() => router.push("/search")}
                >搜索</div>
            </div>
            <TokenListWithQuery />
            {!showSkeleton &&
                ((tokens?.length ?? 0) > 0
                    ? tokens?.map((item, index) => (
                        <div
                            className="border h-[72px] flex items-center f5001 cursor-pointer border-[#F3F3F3] mt-[8px] px-[16px]"
                            key={index}
                            onClick={() => router.push(`/meme/1`)}
                        >
                            <Image
                                src={"/default.png"}
                                className="w-[48px] h-[48px] rounded-[0px] border border-[#F3F3F3] shrink-0"
                            />
                            <div className="h-[40px] flex flex-col justify-center gap-[4px] ml-[8px]">
                                <div className="text-[15px] text-[#101010]">
                                    {item?.symbol && item.symbol.length > 15
                                        ? `${item.symbol.slice(0, 15)}...`
                                        : item?.symbol}
                                </div>
                                <div>
                                    <span className="text-[11px] font-medium text-[rgba(170,170,170,1)]">
                                        市值{" "}
                                        <i className="not-italic text-[11px]  font-medium text-[#101010]">
                                            $18.98K
                                        </i>
                                    </span>
                                    <span className="text-[11px] font-medium text-[rgba(170,170,170,1)] ml-2.5">
                                        24H{" "}
                                        <i className="not-italic text-[11px]  font-medium text-[#41CD5A]">
                                            -18.98%
                                        </i>
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-end flex-1">
                                <div className="w-[60px] h-[32px] relative flex items-center justify-center">
                                    <div
                                        className="w-full h-full  flex items-center justify-center"
                                        style={{
                                            background: "#E8FCEB",
                                            backgroundImage:
                                                "linear-gradient(to right, #41CD5A 50%, #E8FCEB 50%)",
                                        }}
                                    >
                                        <span className="text-[12px] text-[#101010]">
                                            {_bignumber(item?.mintTimes).div(800).times(100).dp(2).toString()}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                    : !isLoading &&
                    !isFetching && (
                        <div className="flex flex-col items-center justify-center py-[60px] pt-[100px]">
                            <div className="text-[#4c4c4c] mt-[12px] text-[13px]">
                                Nothing
                            </div>
                        </div>
                    ))}
            {!showSkeleton && (tokens?.length ?? 0) > 0 && (
                <div className="w-full flex justify-center my-[20px]">
                    <Pagination
                        showControls
                        page={page}
                        onChange={setHomeListPage}
                        total={30}
                        color="success"
                        variant="faded"
                        classNames={{
                            item: "bg-white border-[1px] border-[#F3F3F3] rounded-none text-[12px] w-[24px] h-[24px] min-w-[24px] data-[active=true]:bg-[#333] data-[active=true]:text-[#FFF] data-[selected=true]:bg-[#333] data-[selected=true]:text-[#FFF]",
                            cursor: "bg-[#333] text-[#FFF] rounded-none border-[1px] border-[#F3F3F3] text-[12px] w-[24px] h-[24px] min-w-[24px]",
                            prev: "bg-white rounded-none border-[1px] border-[#F3F3F3] text-[12px] w-[24px] h-[24px] min-w-[24px]",
                            next: "bg-white rounded-none border-[1px] border-[#F3F3F3] text-[12px] w-[24px] h-[24px] min-w-[24px]"
                        }}
                    />
                </div>
            )}
            {showSkeleton &&
                Array(10)
                    .fill(0)
                    .map((item, index) => (
                        <div
                            key={index}
                            className="h-[72px] flex items-center f5001 cursor-pointer bg-[#0E0E0E] rounded-[8px] mt-[8px] px-[16px]"
                        >
                            <Skeleton className="flex rounded-full w-[40px] h-[40px] shrink-0 bg-[#1E1E1E]" />
                            <div className="w-full flex flex-col gap-3 ml-[8px]">
                                <Skeleton className="h-[12px] w-full rounded-lg bg-[#1E1E1E]" />
                                <Skeleton className="h-[12px] w-full rounded-lg bg-[#1E1E1E]" />
                            </div>
                        </div>
                    ))}
        </div>
    );
};

export default List;

const SearchIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
    >
        <circle cx="6" cy="6" r="4.25" stroke="#67646B" stroke-width="1.5" />
        <path
            d="M10.4697 11.5303C10.7626 11.8232 11.2374 11.8232 11.5303 11.5303C11.8232 11.2374 11.8232 10.7626 11.5303 10.4697L11 11L10.4697 11.5303ZM11 11L11.5303 10.4697L9.53033 8.46967L9 9L8.46967 9.53033L10.4697 11.5303L11 11Z"
            fill="#67646B"
        />
    </svg>
);

const ThreeIcon = (props: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        {...props}
    >
        <path
            d="M6.45478 5.0913C6.69473 5.49122 6.40666 6 5.94029 6H2.05971C1.59334 6 1.30527 5.49122 1.54522 5.0913L3.4855 1.85749C3.71855 1.46909 4.28145 1.46909 4.5145 1.85749L6.45478 5.0913Z"
            fill={props.color}
        />
    </svg>
);
