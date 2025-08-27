import { useState, useCallback } from "react";
import { ContractMethods, type ContractCallOptions } from "@/utils/contractUtils";

/**
 * 合约调用状态
 */
export interface ContractCallState {
    loading: boolean;
    error: string | null;
    txHash?: string;
    receipt?: any;
}

/**
 * 使用合约的React Hook
 */
export const useContract = () => {
    const [callState, setCallState] = useState<ContractCallState>({
        loading: false,
        error: null,
    });

    /**
     * 重置状态
     */
    const resetState = useCallback(() => {
        setCallState({
            loading: false,
            error: null,
        });
    }, []);

    /**
     * 调用只读合约方法
     */
    const callMethod = useCallback(async (options: Omit<ContractCallOptions, 'walletProvider' | 'userAddress'>) => {
        setCallState({ loading: true, error: null });
        
        try {
            const result = await ContractMethods.call(options);
            setCallState({ loading: false, error: null });
            return result;
        } catch (error: any) {
            const errorMessage = error?.message || "Contract call failed";
            setCallState({ loading: false, error: errorMessage });
            throw error;
        }
    }, []);

    /**
     * 发送合约交易
     */
    const sendTransaction = useCallback(async (options: ContractCallOptions) => {
        setCallState({ loading: true, error: null });
        
        try {
            const { transaction, receipt } = await ContractMethods.send(options);
            setCallState({ 
                loading: false, 
                error: null, 
                txHash: transaction.hash, 
                receipt 
            });
            return { transaction, receipt };
        } catch (error: any) {
            const errorMessage = error?.message || "Transaction failed";
            setCallState({ loading: false, error: errorMessage });
            throw error;
        }
    }, []);

    /**
     * 估算Gas费用
     */
    const estimateGas = useCallback(async (options: ContractCallOptions) => {
        try {
            return await ContractMethods.estimate(options);
        } catch (error: any) {
            console.error("Gas estimation failed:", error);
            throw error;
        }
    }, []);

    /**
     * Refund方法的便捷调用
     */
    const refund = useCallback(async (
        tokenAddress: string,
        tokenABI: any,
        walletProvider: any,
        userAddress: string,
        gasLimit?: number,
        gasPrice?: string
    ) => {
        return await sendTransaction({
            contractAddress: tokenAddress,
            contractABI: tokenABI,
            methodName: "refund",
            params: [],
            gasLimit,
            gasPrice,
            walletProvider,
            userAddress
        });
    }, [sendTransaction]);

    /**
     * Mint方法的便捷调用
     */
    const mint = useCallback(async (
        tokenAddress: string,
        tokenABI: any,
        walletProvider: any,
        userAddress: string,
        mintFeeInEth: string,
        gasLimit?: number,
        gasPrice?: string
    ) => {
        return await sendTransaction({
            contractAddress: tokenAddress,
            contractABI: tokenABI,
            methodName: "mint",
            params: [],
            value: mintFeeInEth,
            gasLimit,
            gasPrice,
            walletProvider,
            userAddress
        });
    }, [sendTransaction]);

    return {
        // 状态
        ...callState,
        
        // 方法
        callMethod,
        sendTransaction,
        estimateGas,
        resetState,
        
        // 便捷方法
        refund,
        mint,
    };
};

/**
 * 专门用于Token合约的Hook
 */
export const useTokenContract = (tokenAddress: string, tokenABI: any) => {
    const contract = useContract();

    /**
     * 获取代币基本信息
     */
    const getTokenInfo = useCallback(async () => {
        return await ContractMethods.info(tokenAddress, tokenABI);
    }, [tokenAddress, tokenABI]);

    /**
     * 获取余额
     */
    const getBalance = useCallback(async (userAddress: string) => {
        return await contract.callMethod({
            contractAddress: tokenAddress,
            contractABI: tokenABI,
            methodName: "balanceOf",
            params: [userAddress]
        });
    }, [tokenAddress, tokenABI, contract.callMethod]);

    /**
     * 获取mint次数
     */
    const getMintTimes = useCallback(async () => {
        return await contract.callMethod({
            contractAddress: tokenAddress,
            contractABI: tokenABI,
            methodName: "mintTimes",
            params: []
        });
    }, [tokenAddress, tokenABI, contract.callMethod]);

    /**
     * 获取URI
     */
    const getURI = useCallback(async () => {
        return await contract.callMethod({
            contractAddress: tokenAddress,
            contractABI: tokenABI,
            methodName: "uri",
            params: []
        });
    }, [tokenAddress, tokenABI, contract.callMethod]);

    /**
     * Mint代币
     */
    const mint = useCallback(async (
        walletProvider: any,
        userAddress: string,
        mintFeeInEth: string,
        gasLimit?: number,
        gasPrice?: string
    ) => {
        return await contract.mint(
            tokenAddress,
            tokenABI,
            walletProvider,
            userAddress,
            mintFeeInEth,
            gasLimit,
            gasPrice
        );
    }, [tokenAddress, tokenABI, contract.mint]);

    /**
     * Refund
     */
    const refund = useCallback(async (
        walletProvider: any,
        userAddress: string,
        gasLimit?: number,
        gasPrice?: string
    ) => {
        return await contract.refund(
            tokenAddress,
            tokenABI,
            walletProvider,
            userAddress,
            gasLimit,
            gasPrice
        );
    }, [tokenAddress, tokenABI, contract.refund]);

    return {
        // 继承基础合约功能
        ...contract,
        
        // 代币专用方法
        getTokenInfo,
        getBalance,
        getMintTimes,
        getURI,
        mint,
        refund,
    };
};