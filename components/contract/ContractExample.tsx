"use client";

import React, { useState } from "react";
import { Button, Card, CardBody, Input, Textarea } from "@heroui/react";
import { useContract, useTokenContract } from "@/hooks/useContract";
import TokenABI from "@/constant/Token.abi.json";

const ContractExample: React.FC = () => {
    const [tokenAddress, setTokenAddress] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [walletProvider, setWalletProvider] = useState<any>(null);
    
    // 使用通用合约hook
    const contract = useContract();
    
    // 使用代币合约专用hook
    const tokenContract = useTokenContract(tokenAddress, TokenABI.abi);

    // 连接钱包
    const connectWallet = async () => {
        try {
            if (typeof window.ethereum !== 'undefined') {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                setWalletProvider(window.ethereum);
                
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                setUserAddress(accounts[0]);
                
                console.log("钱包已连接:", accounts[0]);
            } else {
                alert("请安装MetaMask钱包");
            }
        } catch (error) {
            console.error("连接钱包失败:", error);
        }
    };

    // Mint代币
    const handleMint = async () => {
        if (!tokenAddress || !walletProvider || !userAddress) {
            alert("请先连接钱包并输入代币地址");
            return;
        }

        try {
            const result = await tokenContract.mint(
                walletProvider,
                userAddress,
                "0.12", // mint费用 0.12 ETH
                undefined, // gasLimit (自动估算)
                "20" // gasPrice in gwei
            );
            
            console.log("Mint成功:", result);
            alert(`Mint成功! 交易哈希: ${result.transaction.hash}`);
        } catch (error) {
            console.error("Mint失败:", error);
            alert("Mint失败: " + (error as Error).message);
        }
    };

    // Refund
    const handleRefund = async () => {
        if (!tokenAddress || !walletProvider || !userAddress) {
            alert("请先连接钱包并输入代币地址");
            return;
        }

        try {
            const result = await tokenContract.refund(
                walletProvider,
                userAddress,
                undefined, // gasLimit (自动估算)
                "20" // gasPrice in gwei
            );
            
            console.log("Refund成功:", result);
            alert(`Refund成功! 交易哈希: ${result.transaction.hash}`);
        } catch (error) {
            console.error("Refund失败:", error);
            alert("Refund失败: " + (error as Error).message);
        }
    };

    // 获取代币信息
    const handleGetTokenInfo = async () => {
        if (!tokenAddress) {
            alert("请输入代币地址");
            return;
        }

        try {
            const info = await tokenContract.getTokenInfo();
            console.log("代币信息:", info);
            alert(`代币信息: \n名称: ${info.name}\n符号: ${info.symbol}\n小数位: ${info.decimals}\n总供应量: ${info.totalSupply}`);
        } catch (error) {
            console.error("获取代币信息失败:", error);
            alert("获取代币信息失败: " + (error as Error).message);
        }
    };

    // 获取余额
    const handleGetBalance = async () => {
        if (!tokenAddress || !userAddress) {
            alert("请先连接钱包并输入代币地址");
            return;
        }

        try {
            const balance = await tokenContract.getBalance(userAddress);
            console.log("代币余额:", balance.toString());
            alert(`代币余额: ${balance.toString()}`);
        } catch (error) {
            console.error("获取余额失败:", error);
            alert("获取余额失败: " + (error as Error).message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Card>
                <CardBody>
                    <h2 className="text-2xl font-bold mb-4">合约调用示例</h2>
                    
                    {/* 钱包连接 */}
                    <div className="mb-6">
                        <Button 
                            onPress={connectWallet}
                            color={walletProvider ? "success" : "primary"}
                            disabled={!!walletProvider}
                        >
                            {walletProvider ? `已连接: ${userAddress?.slice(0, 6)}...${userAddress?.slice(-4)}` : "连接钱包"}
                        </Button>
                    </div>

                    {/* 代币地址输入 */}
                    <div className="mb-6">
                        <Input
                            label="代币合约地址"
                            placeholder="输入代币合约地址"
                            value={tokenAddress}
                            onChange={(e) => setTokenAddress(e.target.value)}
                            className="mb-4"
                        />
                    </div>

                    {/* 交易状态显示 */}
                    {(contract.loading || tokenContract.loading) && (
                        <div className="mb-4 p-3 bg-blue-100 rounded">
                            正在处理交易...
                        </div>
                    )}

                    {(contract.error || tokenContract.error) && (
                        <div className="mb-4 p-3 bg-red-100 rounded text-red-700">
                            错误: {contract.error || tokenContract.error}
                        </div>
                    )}

                    {(contract.txHash || tokenContract.txHash) && (
                        <div className="mb-4 p-3 bg-green-100 rounded">
                            交易哈希: {contract.txHash || tokenContract.txHash}
                        </div>
                    )}

                    {/* 操作按钮 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button 
                            onPress={handleGetTokenInfo}
                            variant="flat"
                            disabled={!tokenAddress}
                        >
                            获取代币信息
                        </Button>
                        
                        <Button 
                            onPress={handleGetBalance}
                            variant="flat"
                            disabled={!tokenAddress || !userAddress}
                        >
                            获取余额
                        </Button>
                        
                        <Button 
                            onPress={handleMint}
                            color="success"
                            disabled={!tokenAddress || !walletProvider || contract.loading || tokenContract.loading}
                        >
                            Mint代币
                        </Button>
                        
                        <Button 
                            onPress={handleRefund}
                            color="warning"
                            disabled={!tokenAddress || !walletProvider || contract.loading || tokenContract.loading}
                        >
                            Refund
                        </Button>
                    </div>
                </CardBody>
            </Card>

            {/* 代码示例 */}
            <Card>
                <CardBody>
                    <h3 className="text-xl font-semibold mb-4">使用示例代码</h3>
                    <Textarea
                        label="React Hook 使用示例"
                        value={`// 1. 导入hooks
import { useContract, useTokenContract } from "@/hooks/useContract";
import TokenABI from "@/constant/Token.abi.json";

// 2. 在组件中使用
const YourComponent = () => {
    const contract = useContract();
    const tokenContract = useTokenContract(tokenAddress, TokenABI.abi);
    
    // 3. 调用合约方法
    const handleMint = async () => {
        const result = await tokenContract.mint(
            walletProvider,   // MetaMask provider
            userAddress,      // 用户地址
            "0.12",          // mint费用 (ETH)
            undefined,       // gasLimit (自动估算)
            "20"            // gasPrice (gwei)
        );
        console.log("Mint成功:", result);
    };
    
    const handleRefund = async () => {
        const result = await tokenContract.refund(
            walletProvider,
            userAddress,
            undefined,       // gasLimit
            "20"            // gasPrice
        );
        console.log("Refund成功:", result);
    };
};`}
                        minRows={20}
                        className="font-mono text-sm"
                        readOnly
                    />
                </CardBody>
            </Card>
        </div>
    );
};

export default ContractExample;