import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import TradePopup from "@/components/trade/Trade";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { DEFAULT_CHAIN_CONFIG } from "@/config/chains";
import { useTokenTrading } from "@/hooks/useTokenTrading";
import { toast } from "sonner";

const Trade = ({ metaData }: any) => {
    const params = useParams();
    const [isTradePopupOpen, setIsTradePopupOpen] = useState(false);
    const [tradeMode, setTradeMode] = useState(true); // true for buy, false for sell
    const [isQuickBuyLoading, setIsQuickBuyLoading] = useState(false);
    const [isSellAllLoading, setIsSellAllLoading] = useState(false);

    // 钱包连接状态
    const { address, isConnected } = useAppKitAccount();
    const { open } = useAppKit();
    const queryClient = useQueryClient();
    const tokenAddress = params.addr as string;

    // 使用trading hooks
    const { handleBuy, handleSell } = useTokenTrading();

    // 同时获取用户的代币余额和OKB余额
    const { data: balances, isLoading: balanceLoading } = useQuery({
        queryKey: ['userBalances', tokenAddress, address],
        queryFn: async () => {
            if (!isConnected || !address) {
                return { tokenBalance: '0', walletBalance: '0' };
            }

            try {
                const provider = new ethers.JsonRpcProvider(DEFAULT_CHAIN_CONFIG.rpcUrl);

                // 同时获取OKB余额和代币余额
                const promises = [
                    // 获取OKB余额
                    provider.getBalance(address)
                ];

                // 如果有代币地址，添加代币余额查询
                if (tokenAddress) {
                    const tokenABI = ["function balanceOf(address owner) view returns (uint256)"];
                    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
                    promises.push(tokenContract.balanceOf(address));
                }

                const results = await Promise.all(promises);

                return {
                    walletBalance: ethers.formatEther(results[0]), // OKB余额
                    tokenBalance: tokenAddress && results[1] ? ethers.formatEther(results[1]) : '0' // 代币余额
                };
            } catch (error) {
                console.error('获取余额失败:', error);
                return { tokenBalance: '0', walletBalance: '0' };
            }
        },
        enabled: !!(isConnected && address), // 只有在钱包连接且有地址时才执行查询
        refetchInterval: 3000, // 每3秒刷新一次余额
        staleTime: 2000, // 2秒内的数据认为是新鲜的
        retry: 2, // 失败时重试2次
    });

    const tokenBalance = balances?.tokenBalance || '0';
    const walletBalance = balances?.walletBalance || '0';

    useEffect(() => {
        console.log(params.addr)
    }, [params]);

    // 检查是否有代币余额可以卖出
    const hasTokenBalance = tokenBalance && parseFloat(tokenBalance) > 0;

    // 快速买入0.5 OKB的函数
    const handleQuickBuy = async () => {
        if (!isConnected) {
            open();
            return;
        }

        setIsQuickBuyLoading(true);
        try {
            await handleBuy(tokenAddress, '0.5');
            toast.success('快速买入成功!', { icon: null });

            // 刷新余额
            await queryClient.invalidateQueries({
                queryKey: ['userBalances']
            });
            await queryClient.invalidateQueries({
                queryKey: ['walletBalance']
            });
        } catch (error: any) {
            console.error('快速买入失败:', error);
            toast.error(`快速买入失败: ${error?.message || '未知错误'}`, { icon: null });
        } finally {
            setIsQuickBuyLoading(false);
        }
    };

    // 全部卖出的函数
    const handleSellAll = async () => {
        if (!isConnected) {
            open();
            return;
        }

        if (!tokenBalance || parseFloat(tokenBalance) <= 0) {
            toast.error('没有代币可以卖出', { icon: null });
            return;
        }

        setIsSellAllLoading(true);
        try {
            await handleSell(tokenAddress, tokenBalance);
            toast.success('全部卖出成功!', { icon: null });
            
            // 刷新余额
            await queryClient.invalidateQueries({ 
                queryKey: ['userBalances'] 
            });
            await queryClient.invalidateQueries({ 
                queryKey: ['walletBalance'] 
            });
        } catch (error: any) {
            console.error('全部卖出失败:', error);
            toast.error(`全部卖出失败: ${error?.message || '未知错误'}`, { icon: null });
        } finally {
            setIsSellAllLoading(false);
        }
    };

    return <div className="pb-[30px]">
        <TradePopup
            isOpen={isTradePopupOpen}
            onOpenChange={setIsTradePopupOpen}
            initialMode={tradeMode}
            tokenAddress={params.addr as string}
            balances={balances}
            metaData={metaData}
        />
        {
            hasTokenBalance ? <Button
                radius="none"
                className={`w-full h-[48px] border-1 text-[14px] bg-[#FDD9ED] border-[#EB4B6D] text-[#EB4B6D]`}
                disabled={isSellAllLoading}
                isLoading={isSellAllLoading}
                onPress={handleSellAll}
            >
                {isSellAllLoading ? '卖出中...' : '全部卖出'}
            </Button> : <Button
                radius="none"
                className="w-full h-[48px] bg-[#E8FCEB] border-[#41CD5A] border-1 text-[14px] text-[#41CD5A]"
                disabled={isQuickBuyLoading}
                isLoading={isQuickBuyLoading}
                onPress={handleQuickBuy}
            >
                {isQuickBuyLoading ? '买入中...' : '快速买入 0.5 OKB'}
            </Button>
        }
        <div className="mt-[12px] flex gap-[12px]">
            {
                hasTokenBalance && <Button
                    radius="none"
                    className={`w-full h-[48px] border-1 text-[14px] bg-[#EB4B6D] border-[#EB4B6D] text-[#FFF]`}
                    onPress={() => {
                        if (hasTokenBalance) {
                            setTradeMode(false); // 设置为卖出模式
                            setIsTradePopupOpen(true);
                        }
                    }}
                >
                    卖出
                </Button>
            }
            <Button
                radius="none"
                className="w-full h-[48px] bg-[#41CD5A] border-[#41CD5A] border-1 text-[14px] text-[#FFF]"
                onPress={() => {
                    setTradeMode(true); // 设置为买入模式
                    setIsTradePopupOpen(true);
                }}
            >
                立即买入
            </Button>
        </div>
    </div>;
}

export default Trade;