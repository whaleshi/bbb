"use client";
import React, { useState, useEffect } from "react";
import { Input, Button, useDisclosure } from "@heroui/react";
import { toast } from "sonner";
import { ethers } from "ethers";
import { useAppKit, useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import Slippage from "@/components/trade/Slippage";

import ResponsiveDialog from "../common/ResponsiveDialog";
import { DEFAULT_CHAIN_CONFIG } from "@/config/chains";

interface TradeProps {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    initialMode?: boolean; // true for buy, false for sell
    tokenAddress?: string; // token address for trading
}

export default function Trade({ isOpen = false, onOpenChange, initialMode = true, tokenAddress }: TradeProps) {
    const [isBuy, setIsBuy] = useState(initialMode);
    const [isSlippageOpen, setIsSlippageOpen] = useState(false);
    const [inputAmount, setInputAmount] = useState("");
    const [outputAmount, setOutputAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // AppKit hooks
    const { open } = useAppKit();
    const { address, isConnected } = useAppKitAccount();
    const { walletProvider } = useAppKitProvider('eip155');

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

    // 买入逻辑封装
    const handleBuy = async (tokenAddress: string, ethAmount: string) => {
        console.log('=== 买入操作 ===');

        if (!isConnected || !address || !walletProvider) {
            throw new Error('请先连接钱包');
        }

        // 确保 walletProvider 是有效的 EIP-1193 provider
        if (typeof (walletProvider as any).request !== 'function') {
            throw new Error('钱包提供者无效');
        }

        const { CONTRACT_CONFIG } = await import("@/config/chains");
        const contractABI = (await import("@/constant/abi.json")).default;

        const provider = new ethers.JsonRpcProvider(DEFAULT_CHAIN_CONFIG.rpcUrl);
        const ethersProvider = new ethers.BrowserProvider(walletProvider as any);
        const signer = await ethersProvider.getSigner();

        console.log('Calling tryBuy with parameters:');
        console.log('Token address:', tokenAddress);
        console.log('Amount:', ethers.parseEther(ethAmount));

        // 1. 调用 tryBuy 获取预期输出
        const readOnlyContract = new ethers.Contract(CONTRACT_CONFIG.FACTORY_CONTRACT, contractABI, provider);
        const result = await readOnlyContract.tryBuy(tokenAddress, ethers.parseEther(ethAmount));

        console.log('tryBuy 返回值:', result);
        console.log('Token Amount Out:', result[0]?.toString());
        console.log('Refund:', result[1]?.toString());

        // 2. 计算3%滑点保护
        const tokenAmountOut = result[0];
        const minAmountOut = (tokenAmountOut * BigInt(97)) / BigInt(100);

        console.log('调用 buyToken 参数:');
        console.log('Token address:', tokenAddress);
        console.log('Amount:', ethers.parseEther(ethAmount));
        console.log('MinAmountOut (with 3% slippage):', minAmountOut.toString());

        // 3. 执行买入交易
        const contract = new ethers.Contract(CONTRACT_CONFIG.FACTORY_CONTRACT, contractABI, signer);

        console.log('发送 buyToken 交易...');

        // 估算 gas limit
        let gasLimit;
        try {
            const estimatedGas = await contract.buyToken.estimateGas(
                tokenAddress,
                ethers.parseEther(ethAmount),
                minAmountOut,
                { value: ethers.parseEther(ethAmount) }
            );
            gasLimit = (estimatedGas * BigInt(120)) / BigInt(100); // +20% buffer
            console.log('预估 Gas Limit:', gasLimit.toString());
        } catch (e) {
            console.warn('Gas 估算失败:', e);
            gasLimit = undefined;
        }

        // 获取 gas price
        const gasPrice = (await ethersProvider.getFeeData()).gasPrice;
        const newGasPrice = gasPrice ? gasPrice + (gasPrice * BigInt(5)) / BigInt(100) : null; // +5%
        console.log('Gas Price:', {
            original: gasPrice?.toString(),
            new: newGasPrice?.toString()
        });

        const txOptions = {
            value: ethers.parseEther(ethAmount),
            type: 0, // 强制使用 Legacy 交易类型
        } as any;

        if (gasLimit) {
            txOptions.gasLimit = gasLimit;
        }
        if (newGasPrice) {
            txOptions.gasPrice = newGasPrice;
        }

        const buyResult = await contract.buyToken(
            tokenAddress,
            ethers.parseEther(ethAmount),
            minAmountOut,
            txOptions
        );

        console.log('buyToken 交易已发送:', buyResult.hash);
        const receipt = await buyResult.wait();
        console.log('buyToken 交易已确认:', receipt);

        return {
            txHash: buyResult.hash,
            receipt,
            tokenAmountOut: result[0]?.toString(),
            refund: result[1]?.toString()
        };
    };

    // 卖出逻辑封装
    const handleSell = async (tokenAddress: string) => {
        console.log('=== 卖出操作 ===');

        if (!isConnected || !address || !walletProvider) {
            throw new Error('请先连接钱包');
        }

        // 确保 walletProvider 是有效的 EIP-1193 provider
        if (typeof (walletProvider as any).request !== 'function') {
            throw new Error('钱包提供者无效');
        }

        const { CONTRACT_CONFIG } = await import("@/config/chains");
        const contractABI = (await import("@/constant/abi.json")).default;

        const provider = new ethers.JsonRpcProvider(DEFAULT_CHAIN_CONFIG.rpcUrl);
        const ethersProvider = new ethers.BrowserProvider(walletProvider as any);
        const signer = await ethersProvider.getSigner();

        // 1. 获取代币余额
        const tokenABI = [
            "function balanceOf(address owner) view returns (uint256)",
            "function approve(address spender, uint256 amount) returns (bool)",
            "function allowance(address owner, address spender) view returns (uint256)"
        ];

        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
        const balance = await tokenContract.balanceOf(address);

        console.log('代币余额:', balance.toString());

        if (balance === BigInt(0)) {
            throw new Error('代币余额为0，无法卖出');
        }

        // 2. 调用 trySell 获取预期输出
        const readOnlyContract = new ethers.Contract(CONTRACT_CONFIG.FACTORY_CONTRACT, contractABI, provider);
        const sellResult = await readOnlyContract.trySell(tokenAddress, balance);

        console.log('trySell 返回值:', sellResult);
        console.log('ETH Amount Out:', sellResult.toString());

        // 3. 计算3%滑点保护
        const ethAmountOut = sellResult;
        const minEthOut = (ethAmountOut * BigInt(97)) / BigInt(100);

        console.log('MinEthOut (with 3% slippage):', minEthOut.toString());

        // 4. 检查和执行授权
        const factoryContract = new ethers.Contract(CONTRACT_CONFIG.FACTORY_CONTRACT, contractABI, signer);
        const allowance = await tokenContract.allowance(address, CONTRACT_CONFIG.FACTORY_CONTRACT);

        console.log('当前授权额度:', allowance.toString());

        let approveTxHash = null;
        if (allowance < balance) {
            console.log('需要授权，发送 approve 交易...');

            // 估算 approve 的 gas limit
            let approveGasLimit;
            try {
                const estimatedGas = await tokenContract.approve.estimateGas(
                    CONTRACT_CONFIG.FACTORY_CONTRACT,
                    balance
                );
                approveGasLimit = (estimatedGas * BigInt(120)) / BigInt(100); // +20% buffer
                console.log('Approve 预估 Gas Limit:', approveGasLimit.toString());
            } catch (e) {
                console.warn('Approve Gas 估算失败:', e);
                approveGasLimit = undefined;
            }

            // 获取 gas price
            const gasPrice = (await provider.getFeeData()).gasPrice;
            const newGasPrice = gasPrice ? gasPrice + (gasPrice * BigInt(5)) / BigInt(100) : null; // +5%

            const approveTxOptions = {
                type: 0, // 强制使用 Legacy 交易类型
            } as any;

            if (approveGasLimit) {
                approveTxOptions.gasLimit = approveGasLimit;
            }
            if (newGasPrice) {
                approveTxOptions.gasPrice = newGasPrice;
            }

            const approveResult = await tokenContract.approve(
                CONTRACT_CONFIG.FACTORY_CONTRACT,
                balance,
                approveTxOptions
            );

            console.log('授权交易已发送:', approveResult.hash);
            const approveReceipt = await approveResult.wait();
            console.log('授权交易已确认:', approveReceipt);
            approveTxHash = approveResult.hash;
        }

        // 5. 执行卖出操作
        console.log('发送 sellToken 交易...');
        console.log('卖出参数:');
        console.log('Token address:', tokenAddress);
        console.log('Amount:', balance.toString());
        console.log('MinAmountOut:', minEthOut.toString());

        // 估算 sellToken 的 gas limit
        let sellGasLimit;
        try {
            const estimatedGas = await factoryContract.sellToken.estimateGas(
                tokenAddress,
                balance,
                minEthOut
            );
            sellGasLimit = (estimatedGas * BigInt(120)) / BigInt(100); // +20% buffer
            console.log('SellToken 预估 Gas Limit:', sellGasLimit.toString());
        } catch (e) {
            console.warn('SellToken Gas 估算失败:', e);
            sellGasLimit = undefined;
        }

        // 获取 gas price
        const gasPrice = (await ethersProvider.getFeeData()).gasPrice;
        const newGasPrice = gasPrice ? gasPrice + (gasPrice * BigInt(5)) / BigInt(100) : null; // +5%
        console.log('SellToken Gas Price:', {
            original: gasPrice?.toString(),
            new: newGasPrice?.toString()
        });

        const sellTxOptions = {
            type: 0, // 强制使用 Legacy 交易类型
        } as any;

        if (sellGasLimit) {
            sellTxOptions.gasLimit = sellGasLimit;
        }
        if (newGasPrice) {
            sellTxOptions.gasPrice = newGasPrice;
        }

        const sellTxResult = await factoryContract.sellToken(
            tokenAddress,
            balance,
            minEthOut,
            sellTxOptions
        );

        console.log('sellToken 交易已发送:', sellTxResult.hash);
        const sellReceipt = await sellTxResult.wait();
        console.log('sellToken 交易已确认:', sellReceipt);

        return {
            txHash: sellTxResult.hash,
            receipt: sellReceipt,
            approveTxHash,
            ethAmountOut: ethAmountOut.toString(),
            tokenBalance: balance.toString()
        };
    };

    const handleTradeSubmit = async () => {
        // 如果未连接钱包，打开连接弹窗
        if (!isConnected) {
            open();
            return;
        }

        setIsLoading(true);

        try {
            // 使用传入的tokenAddress，如果没有则使用默认地址
            const currentTokenAddress = tokenAddress as string;

            if (isBuy) {
                // 执行买入操作
                const result = await handleBuy(currentTokenAddress, '1');
                toast.success(`买入成功! TxHash: ${result.txHash.slice(0, 10)}... TokenAmount: ${result.tokenAmountOut}`);
            } else {
                // 执行卖出操作
                const result = await handleSell(currentTokenAddress);
                toast.success(`卖出成功! TxHash: ${result.txHash.slice(0, 10)}... ETHAmount: ${result.ethAmountOut}`);
            }

            // 重置状态
            setInputAmount("");
            setOutputAmount("");
        } catch (error: any) {
            console.error(`${isBuy ? '买入' : '卖出'}操作失败:`, error);
            toast.error(`${isBuy ? '买入' : '卖出'}失败: ${error?.message || '未知错误'}`);
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
                        余额 <i className="text-[#101010]  not-italic">{isConnected ? '已连接钱包' : '未连接钱包'}</i>
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
                    {isLoading ? "交易中..." : !isConnected ? "连接钱包" : (isBuy ? "立即买入" : "立即卖出")}
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
