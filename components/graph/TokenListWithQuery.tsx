'use client'

import { useTokens } from '../../hooks/useTokens'
import TokenAvatar from '../common/TokenAvatar'
import { useRouter } from "next/navigation"

export default function TokenListWithQuery() {
    const router = useRouter()
    const { data: tokens, isLoading, error } = useTokens({ first: 10 })

    if (isLoading) return <div>加载中...</div>
    if (error) return <div>错误: {error.message}</div>

    return (
        <>
            {tokens?.map((token, index) => (
                <div
                    className="border h-[72px] flex items-center f5001 cursor-pointer border-[#F3F3F3] mt-[8px] px-[16px]"
                    key={index}
                    onClick={() => router.push(`/meme/${token.id}`)}
                >
                    <TokenAvatar
                        uri={token.uri}
                        name={token.name}
                        size="md"
                        className="w-[48px] h-[48px] shrink-0"
                    />
                    <div className="h-[40px] flex flex-col justify-center gap-[4px] ml-[8px]">
                        <div className="text-[15px] text-[#101010]">
                            {token?.symbol && token.symbol.length > 15
                                ? `${token.symbol.slice(0, 15)}...`
                                : token?.symbol}
                        </div>
                        <div>
                            <span className="text-[11px] font-medium text-[rgba(170,170,170,1)]">
                                市值{" "}
                                <i className="not-italic text-[11px] font-medium text-[#101010]">
                                    $18.98K
                                </i>
                            </span>
                            <span className="text-[11px] font-medium text-[rgba(170,170,170,1)] ml-2.5">
                                24H{" "}
                                <i className="not-italic text-[11px] font-medium text-[#41CD5A]">
                                    -18.98%
                                </i>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-end flex-1">
                        <div className="w-[60px] h-[32px] relative flex items-center justify-center">
                            <div
                                className="w-full h-full flex items-center justify-center"
                                style={{
                                    background: "#E8FCEB",
                                    backgroundImage: `linear-gradient(to right, #41CD5A ${((parseInt(token.mintTimes || '0') / 800 * 100) || 0)}%, #E8FCEB ${((parseInt(token.mintTimes || '0') / 800 * 100) || 0)}%)`,
                                }}
                            >
                                <span className="text-[12px] text-[#101010]">
                                    {((parseInt(token.mintTimes || '0') / 800 * 100) || 0).toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}