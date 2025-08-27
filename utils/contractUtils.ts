import { ethers, JsonRpcProvider, BrowserProvider } from "ethers";
import { DEFAULT_CHAIN_CONFIG } from "@/config/chains";

/**
 * 合约调用配置接口
 */
export interface ContractCallOptions {
    contractAddress: string;
    contractABI: any;
    methodName: string;
    params?: any[];
    value?: string; // ETH value to send (in ETH, not wei)
    gasLimit?: number;
    gasPrice?: string; // in gwei
    walletProvider?: any; // 钱包提供者 (如MetaMask)
    userAddress?: string;
}

/**
 * 获取Gas价格和限制
 */
const getGasSettings = async (provider: JsonRpcProvider | BrowserProvider, gasPrice?: string, gasLimit?: number) => {
    const settings: any = {};

    // 设置gas limit
    if (gasLimit) {
        settings.gasLimit = gasLimit;
    }

    // 设置gas price
    if (gasPrice) {
        // 将gwei转换为wei
        settings.gasPrice = ethers.parseUnits(gasPrice, "gwei");
    } else {
        // 获取当前网络的gas price
        try {
            const feeData = await provider.getFeeData();
            if (feeData.gasPrice) {
                settings.gasPrice = feeData.gasPrice;
            }
        } catch (error) {
            console.warn("Failed to get gas price:", error);
        }
    }

    return settings;
};

/**
 * 使用ethers调用合约方法 (只读)
 */
export const callContractMethod = async (options: Omit<ContractCallOptions, 'walletProvider' | 'userAddress'>) => {
    try {
        const { contractAddress, contractABI, methodName, params = [] } = options;

        // 创建provider
        const provider = new JsonRpcProvider(DEFAULT_CHAIN_CONFIG.rpcUrl);
        
        // 创建合约实例
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        // 调用合约方法
        const result = await contract[methodName](...params);
        
        console.log(`Contract call ${methodName} result:`, result);
        return result;
    } catch (error) {
        console.error(`Error calling contract method ${options.methodName}:`, error);
        throw error;
    }
};

/**
 * 使用ethers发送合约交易 (写入)
 */
export const sendContractTransaction = async (options: ContractCallOptions) => {
    try {
        const { 
            contractAddress, 
            contractABI, 
            methodName, 
            params = [], 
            value, 
            gasLimit, 
            gasPrice,
            walletProvider,
            userAddress 
        } = options;

        if (!walletProvider) {
            throw new Error("Wallet provider is required for transactions");
        }

        if (!userAddress) {
            throw new Error("User address is required for transactions");
        }

        // 创建browser provider (连接钱包)
        const provider = new BrowserProvider(walletProvider);
        const signer = await provider.getSigner();

        // 创建合约实例
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        // 准备交易选项
        const txOptions: any = {
            from: userAddress,
        };

        // 添加ETH value (如果有)
        if (value) {
            txOptions.value = ethers.parseEther(value);
        }

        // 获取gas设置
        const gasSettings = await getGasSettings(provider, gasPrice, gasLimit);
        Object.assign(txOptions, gasSettings);

        console.log(`Sending transaction to ${methodName} with options:`, txOptions);

        // 发送交易
        const transaction = await contract[methodName](...params, txOptions);
        
        console.log("Transaction sent:", transaction.hash);
        
        // 等待交易确认
        const receipt = await transaction.wait();
        
        console.log("Transaction confirmed:", receipt);
        
        return {
            transaction,
            receipt
        };
    } catch (error) {
        console.error(`Error sending transaction ${options.methodName}:`, error);
        throw error;
    }
};

/**
 * 基于你的示例，封装refund方法
 */
export const callRefund = async (
    mintId: string, 
    baseTokenABI: any,
    walletProvider: any,
    userAddress: string,
    gasLimit?: number,
    gasPrice?: string // in gwei
) => {
    return await sendContractTransaction({
        contractAddress: mintId,
        contractABI: baseTokenABI,
        methodName: "refund",
        params: [],
        // value: "0.02", // 如果需要发送ETH，取消注释
        gasLimit,
        gasPrice,
        walletProvider,
        userAddress
    });
};

/**
 * 封装mint方法
 */
export const callMint = async (
    tokenAddress: string,
    tokenABI: any,
    walletProvider: any,
    userAddress: string,
    mintFeeInEth: string,
    gasLimit?: number,
    gasPrice?: string
) => {
    return await sendContractTransaction({
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
};

/**
 * 获取合约信息的辅助方法
 */
export const getContractInfo = async (contractAddress: string, contractABI: any) => {
    try {
        const provider = new JsonRpcProvider(DEFAULT_CHAIN_CONFIG.rpcUrl);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        // 获取常用信息
        const [name, symbol, decimals, totalSupply] = await Promise.all([
            contract.name?.() || "Unknown",
            contract.symbol?.() || "N/A", 
            contract.decimals?.() || 18,
            contract.totalSupply?.() || 0
        ]);

        return {
            name,
            symbol,
            decimals,
            totalSupply: totalSupply.toString()
        };
    } catch (error) {
        console.error("Error getting contract info:", error);
        throw error;
    }
};

/**
 * 估算gas费用
 */
export const estimateGas = async (options: ContractCallOptions) => {
    try {
        const { contractAddress, contractABI, methodName, params = [], value, walletProvider, userAddress } = options;

        if (!walletProvider || !userAddress) {
            throw new Error("Wallet provider and user address required for gas estimation");
        }

        const provider = new BrowserProvider(walletProvider);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const txOptions: any = { from: userAddress };
        if (value) {
            txOptions.value = ethers.parseEther(value);
        }

        // 估算gas
        const gasEstimate = await contract[methodName].estimateGas(...params, txOptions);
        
        // 获取当前gas price
        const feeData = await provider.getFeeData();
        
        return {
            gasLimit: gasEstimate,
            gasPrice: feeData.gasPrice
        };
    } catch (error) {
        console.error("Error estimating gas:", error);
        throw error;
    }
};

// 导出常用的合约调用模式
export const ContractMethods = {
    // 只读调用
    call: callContractMethod,
    // 写入交易
    send: sendContractTransaction,
    // 获取合约信息
    info: getContractInfo,
    // 估算gas
    estimate: estimateGas,
    // 特定方法
    refund: callRefund,
    mint: callMint
};