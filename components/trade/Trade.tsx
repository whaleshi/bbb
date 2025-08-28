"use client";
import React, { useState, useEffect } from "react";
import { Input, Button, useDisclosure } from "@heroui/react";
import { toast } from "sonner";
import { useAppKit } from "@reown/appkit/react";
import Slippage from "@/components/trade/Slippage";
import { useTokenTrading } from "@/hooks/useTokenTrading";
import ResponsiveDialog from "../common/ResponsiveDialog";
import { formatBigNumber } from '@/utils/formatBigNumber';
import _bignumber from "bignumber.js";
import { useSlippageStore } from "@/stores/useSlippageStore";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { DEFAULT_CHAIN_CONFIG } from "@/config/chains";

interface TradeProps {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    initialMode?: boolean; // true for buy, false for sell
    tokenAddress?: string; // token address for trading
    balances?: any; // user's token balance
    metaData?: any; // token metadata
}

export default function Trade({ isOpen = false, onOpenChange, initialMode = true, tokenAddress, balances, metaData }: TradeProps) {
    const [isBuy, setIsBuy] = useState(initialMode);
    const [isSlippageOpen, setIsSlippageOpen] = useState(false);
    const [inputAmount, setInputAmount] = useState("");
    const [outputAmount, setOutputAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // AppKit hooks
    const { open } = useAppKit();
    const queryClient = useQueryClient();

    // 使用自定义trading hooks
    const { handleBuy, handleSell, isConnected, address } = useTokenTrading();
    const { slippage } = useSlippageStore();

    // 预估输出金额 - 当输入框有值时每3秒调用一次
    const { data: estimatedOutput } = useQuery({
        queryKey: ['estimateOutput', tokenAddress, inputAmount, isBuy, address],
        queryFn: async () => {
            if (!inputAmount || !tokenAddress || !isConnected || !address || parseFloat(inputAmount) <= 0) {
                return '0';
            }

            try {
                const { CONTRACT_CONFIG } = await import('@/config/chains');
                const contractABI = (await import('@/constant/abi.json')).default;
                const provider = new ethers.JsonRpcProvider(DEFAULT_CHAIN_CONFIG.rpcUrl);
                const readOnlyContract = new ethers.Contract(CONTRACT_CONFIG.FACTORY_CONTRACT, contractABI, provider);

                if (isBuy) {
                    // 调用 tryBuy 获取预期代币输出
                    const result = await readOnlyContract.tryBuy(tokenAddress, ethers.parseEther(inputAmount));
                    const tokenAmountOut = result[0];
                    return ethers.formatEther(tokenAmountOut);
                } else {
                    // 调用 trySell 获取预期ETH输出
                    const sellAmount = ethers.parseEther(inputAmount);
                    const result = await readOnlyContract.trySell(tokenAddress, sellAmount);
                    return ethers.formatEther(result);
                }
            } catch (error) {
                console.error('预估输出失败:', error);
                return '0';
            }
        },
        enabled: !!(inputAmount && tokenAddress && isConnected && address && parseFloat(inputAmount) > 0),
        refetchInterval: 3000, // 每3秒刷新一次
        staleTime: 2000,
        retry: 1,
    });

    const buyAmounts = [
        { label: "0.1 OKB", value: 0.1 },
        { label: "0.3 OKB", value: 0.3 },
        { label: "0.5 OKB", value: 0.5 },
        { label: "最多", value: 1 }
    ];

    const sellAmounts = [
        { label: "25%", value: 0.25 },
        { label: "50%", value: 0.5 },
        { label: "75%", value: 0.75 },
        { label: "100%", value: 1.0 }
    ];

    const tabs = [
        { id: true, label: "买入" },
        { id: false, label: "卖出" }
    ];

    // 监听initialMode变化，在弹窗打开时设置对应的模式
    useEffect(() => {
        if (isOpen) {
            setIsBuy(initialMode);
            setInputAmount(""); // 清空输入框
        }
    }, [isOpen, initialMode]);

    // 监听买入/卖出模式切换，清空输入框
    useEffect(() => {
        setInputAmount("");
        setOutputAmount("");
    }, [isBuy]);

    // 监听预估输出变化，更新输出框
    useEffect(() => {
        if (estimatedOutput) {
            // 格式化输出，去除多余的小数位
            const formatted = parseFloat(estimatedOutput).toFixed(6).replace(/\.?0+$/, '');
            setOutputAmount(formatted);
        } else {
            setOutputAmount("");
        }
    }, [estimatedOutput]);

    const handleAmountClick = (amount: { label: string; value: number | null }) => {
        if (isLoading) return; // 加载中禁用点击

        if (amount.value === null) {
            // 处理"更多"按钮逻辑
            return;
        }

        if (isBuy) {
            // 买入时直接设置金额，确保不超过1
            const finalAmount = Math.min(amount.value, 1);
            setInputAmount(finalAmount.toString());
        } else {
            // 卖出时按百分比计算，基于实际的token余额，使用bignumber确保精度
            if (balances?.tokenBalance && _bignumber(balances?.tokenBalance).gt(0)) {
                try {
                    const userBalance = _bignumber(balances?.tokenBalance);
                    const percentage = _bignumber(amount.value);
                    const sellAmount = userBalance.times(percentage);

                    // 格式化结果，去除尾随零
                    const formattedAmount = sellAmount.dp(18, _bignumber.ROUND_DOWN).toFixed();
                    setInputAmount(formattedAmount.replace(/\.?0+$/, ''));
                } catch (error) {
                    console.error('计算卖出金额失败:', error);
                    setInputAmount('0');
                }
            } else {
                // 如果没有余额，设置为0
                setInputAmount('0');
            }
        }
    };


    const handleTradeSubmit = async () => {
        // 如果未连接钱包，打开连接弹窗
        if (!isConnected) {
            open();
            return;
        }

        // 验证输入金额
        if (!inputAmount || parseFloat(inputAmount) <= 0) {
            toast.error('请输入有效的交易金额');
            return;
        }

        setIsLoading(true);

        try {
            // 使用传入的tokenAddress，如果没有则使用默认地址
            const currentTokenAddress = tokenAddress as string;

            if (isBuy) {
                const result = await handleBuy(currentTokenAddress, inputAmount);
                toast.success(`买入成功!`, { icon: null });
            } else {
                const result = await handleSell(currentTokenAddress, inputAmount);
                toast.success(`卖出成功!`, { icon: null });
            }

            await queryClient.invalidateQueries({
                queryKey: ['userBalances']
            });
            await queryClient.invalidateQueries({
                queryKey: ['walletBalance']
            });

            // 重置状态
            setInputAmount("");
            setOutputAmount("");
        } catch (error: any) {
            console.error(`${isBuy ? '买入' : '卖出'}操作失败:`, error);
            toast.error(`${isBuy ? '买入' : '卖出'}失败`, { icon: null });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Slippage isOpen={isSlippageOpen} onOpenChange={setIsSlippageOpen} />
            <ResponsiveDialog
                isOpen={isOpen}
                onOpenChange={onOpenChange ?? (() => { })}
                maxVH={70}
                size="md"
                classNames={{ body: "text-[#fff]", header: "justify-start" }}
                title={
                    <div className="flex gap-[16px] text-[16px]">
                        {tabs.map((tab) => (
                            <div
                                key={String(tab.id)}
                                className={
                                    isBuy === tab.id
                                        ? "text-[#101010] cursor-pointer"
                                        : "cursor-pointer text-[#999]"
                                }
                                onClick={() => setIsBuy(tab.id)}
                            >
                                {tab.label}
                            </div>
                        ))}
                    </div>
                }
            >
                <div>
                    <Input
                        classNames={{
                            inputWrapper:
                                "px-[18px] py-3.5 rounded-none border-[1px] border-[#F3F3F3] h-[52]",
                            input: "text-[14px] text-[#101010] placeholder:text-[#999] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                        }}
                        labelPlacement="outside"
                        placeholder={isBuy ? "0.00 (最大1)" : "0.00"}
                        variant="bordered"
                        type="text"
                        inputMode="decimal"
                        value={inputAmount}
                        onChange={(e) => {
                            const value = e.target.value;
                            // 只允许数字和小数点
                            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                if (isBuy) {
                                    // 买入时限制最大值为1
                                    const numValue = parseFloat(value);
                                    if (value === '' || (!isNaN(numValue) && numValue <= 1)) {
                                        setInputAmount(value);
                                    }
                                } else {
                                    // 卖出时不限制
                                    setInputAmount(value);
                                }
                            }
                        }}
                        onKeyDown={(e) => {
                            // 阻止上下箭头键
                            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                e.preventDefault();
                            }
                        }}
                        disabled={isLoading}
                        endContent={
                            <span className="text-sm font-medium text-[#101010]">{!isBuy ? metaData?.symbol : 'OKB'}</span>
                        }
                    />
                </div>
                <div className="flex items-center justify-between gap-[12px]">
                    {(isBuy ? buyAmounts : sellAmounts).map((amount) => (
                        <Button
                            key={amount.label}
                            radius="none"
                            fullWidth
                            className="bg-[#F3F3F3] text-[#101010] text-[12px]"
                            disabled={isLoading}
                            onClick={() => handleAmountClick(amount)}
                        >
                            {amount.label}
                        </Button>
                    ))}
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[#EB4B6D] text-xs">
                        {isBuy && '* 单次最多支持买入 1 OKB'}
                    </span>
                    <span className="text-[#999] text-xs">
                        余额 <i className="text-[#101010]  not-italic">{isConnected ? formatBigNumber(isBuy ? balances?.walletBalance : balances?.tokenBalance) : '-'}</i>
                    </span>
                </div>
                <div>
                    <div className="text-[16px] text-[#101010] mb-[12px]">预计获得</div>
                    <Input
                        classNames={{
                            inputWrapper:
                                "px-[18px] py-3.5 rounded-none border-[1px] border-[#F3F3F3] h-[52]",
                            input: "text-[14px] text-[#101010] placeholder:text-[#999]",
                        }}
                        labelPlacement="outside"
                        placeholder="0.00"
                        variant="bordered"
                        value={outputAmount}
                        readOnly
                        endContent={
                            <span className="text-sm font-medium text-[#101010]">{isBuy ? metaData?.symbol : 'OKB'}</span>
                        }
                    />
                </div>
                <Button
                    radius="none"
                    className={`text-[#fff] h-[48px] ${isBuy ? "bg-[#41CD5A]" : "bg-[#EB4B6D]"
                        }`}
                    disabled={isLoading}
                    isLoading={isLoading}
                    onPress={handleTradeSubmit}
                >
                    {isLoading ? "交易中..." : !isConnected ? "连接钱包" : (isBuy ? "立即买入" : "立即卖出")}
                </Button>

                <div className="border p-4 border-solid border-[#F3F3F3] mb-[10px]">
                    <div className="flex items-center justify-between text-[12px]">
                        <span className="text-[#999] ">交易滑点</span>
                        <span className="text-[#999]">
                            <span className="underline text-[#101010]">{slippage}%</span>
                            <span
                                className="cursor-pointer hover:text-[#41CD5A] ml-[4px]"
                                onClick={() => setIsSlippageOpen(true)}
                            >
                                设置
                            </span>
                        </span>
                    </div>
                </div>
            </ResponsiveDialog>
        </div>
    );
}

type IconProps = {
    size?: number;
    height?: number;
    width?: number;
    [x: string]: any;
};

export const CopyIcon = ({ size, height, width, ...props }: IconProps) => {
    return (
        <svg
            fill="none"
            height={size || height || 12}
            shapeRendering="geometricPrecision"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            width={size || width || 12}
            {...props}
        >
            <path d="M6 17C4.89543 17 4 16.1046 4 15V5C4 3.89543 4.89543 3 6 3H13C13.7403 3 14.3866 3.4022 14.7324 4M11 21H18C19.1046 21 20 20.1046 20 19V9C20 7.89543 19.1046 7 18 7H11C9.89543 7 9 7.89543 9 9V19C9 20.1046 9.89543 21 11 21Z" />
        </svg>
    );
};

export const CheckIcon = ({ size, height, width, ...props }: IconProps) => {
    return (
        <svg
            fill="currentColor"
            height={size || height || 12}
            viewBox="0 0 24 24"
            width={size || width || 12}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="m2.394 13.742 4.743 3.62 7.616-8.704-1.506-1.316-6.384 7.296-3.257-2.486zm19.359-5.084-1.506-1.316-6.369 7.279-.753-.602-1.25 1.562 2.247 1.798z" />
        </svg>
    );
};
