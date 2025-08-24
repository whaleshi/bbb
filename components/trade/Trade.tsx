"use client";
import React, { useState, useEffect } from "react";
import { Input, Button, useDisclosure } from "@heroui/react";
import { toast } from "sonner";
import Slippage from "@/components/trade/Slippage";

import ResponsiveDialog from "../common/ResponsiveDialog";

interface TradeProps {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    initialMode?: boolean; // true for buy, false for sell
}

export default function Trade({ isOpen = false, onOpenChange, initialMode = true }: TradeProps) {
    const [isBuy, setIsBuy] = useState(initialMode);
    const [isSlippageOpen, setIsSlippageOpen] = useState(false);
    const [inputAmount, setInputAmount] = useState("");
    const [outputAmount, setOutputAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const buyAmounts = [
        { label: "0.1 OKB", value: 0.1 },
        { label: "0.2 OKB", value: 0.2 },
        { label: "0.3 OKB", value: 0.3 },
        { label: "最多", value: 0.5 }
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
        }
    }, [isOpen, initialMode]);

    const handleAmountClick = (amount: { label: string; value: number | null }) => {
        if (isLoading) return; // 加载中禁用点击
        
        if (amount.value === null) {
            // 处理"更多"按钮逻辑
            return;
        }

        if (isBuy) {
            // 买入时直接设置金额
            setInputAmount(amount.value.toString());
        } else {
            // 卖出时按百分比计算（这里假设用户余额，实际应该从状态或API获取）
            const userBalance = 1.0; // 示例余额，实际应该从状态获取
            const sellAmount = userBalance * amount.value;
            setInputAmount(sellAmount.toString());
        }
    };

    const handleTradeSubmit = async () => {
        setIsLoading(true);
        
        try {
            // 模拟交易请求
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 显示成功提示
            toast.success(`${isBuy ? '买入' : '卖出'}交易成功！`);
            
            // 重置状态
            setInputAmount("");
            setOutputAmount("");
        } catch (error) {
            console.error('交易失败:', error);
            
            // 显示失败提示
            toast.error('交易失败，请重试');
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
                            input: "text-[14px] text-[#101010] placeholder:text-[#999]",
                        }}
                        labelPlacement="outside"
                        placeholder="0.00"
                        variant="bordered"
                        value={inputAmount}
                        onChange={(e) => setInputAmount(e.target.value)}
                        disabled={isLoading}
                        endContent={
                            <span className="text-sm font-medium text-[#101010]">OKB</span>
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
                        * 内盘单钱包最多支持买入 0.5 OKB
                    </span>
                    <span className="text-[#999] text-xs">
                        余额 <i className="text-[#101010]  not-italic">0.0 OKB</i>
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
                            <span className="text-sm font-medium text-[#101010]">OKBRO</span>
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
                    {isLoading ? "交易中..." : (isBuy ? "立即买入" : "立即卖出")}
                </Button>

                <div className="border p-4 border-solid border-[#F3F3F3]">
                    <div className="flex items-center justify-between text-[12px] pb-[12px]">
                        <span className="text-[#999] ">交易滑点</span>
                        <span className="text-[#999]">
                            <span className="underline text-[#101010]">7.89%</span>
                            <span
                                className="cursor-pointer hover:text-[#41CD5A] ml-[4px]"
                                onClick={() => setIsSlippageOpen(true)}
                            >
                                设置
                            </span>
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-[12px]  pb-[12px]">
                        <span className="text-[#999]">已买入</span>
                        <span className="text-[#101010]">0.48 OKB</span>
                    </div>
                    <div className="flex items-center justify-between text-[12px]">
                        <span className="text-[#999]">剩余可买</span>
                        <span className="text-[#101010]">0.02 OKB</span>
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
