import { useQuery } from "@tanstack/react-query";
import { ethers, JsonRpcProvider, Interface } from "ethers";
import { CONTRACT_CONFIG, MULTICALL3_ADDRESS, MULTICALL3_ABI, DEFAULT_CHAIN_CONFIG } from "@/config/chains";
import TokenFactoryABI from "@/constant/OkayFunFactory3.abi.json";
import TokenABI from "@/constant/Token.abi.json";

// 代币基础信息接口
export interface TokenInfo {
    address: string;
    index: number;
    mintTimes: number;
    uri: string;
    metadata?: TokenMetadata | null;
}

// 从URI获取的代币元数据接口
export interface TokenMetadata {
    name: string;
    symbol: string;
    description?: string;
    image?: string;
    [key: string]: any;
}

// 获取代币总数
const getTokenCount = async (): Promise<number> => {
    try {
        const provider = new JsonRpcProvider(DEFAULT_CHAIN_CONFIG.rpcUrl);
        const factoryContract = new ethers.Contract(CONTRACT_CONFIG.FACTORY_CONTRACTV3, TokenFactoryABI.abi, provider);
        
        const tokenCount = await factoryContract.tokenCount();
        console.log("Token count:", Number(tokenCount));
        return Number(tokenCount);
    } catch (error) {
        console.error("Error getting token count:", error);
        throw error;
    }
};

// 批量获取所有代币信息
const getAllTokensInfo = async (): Promise<TokenInfo[]> => {
    try {
        const provider = new JsonRpcProvider(DEFAULT_CHAIN_CONFIG.rpcUrl);
        const multicallContract = new ethers.Contract(MULTICALL3_ADDRESS, MULTICALL3_ABI, provider);
        const factoryInterface = new Interface(TokenFactoryABI.abi);

        // 首先获取代币总数
        const tokenCount = await getTokenCount();
        
        if (tokenCount === 0) {
            return [];
        }

        console.log(`准备获取 ${tokenCount} 个代币的信息`);

        // 准备multicall调用
        const calls = [];
        
        // 为每个代币准备3个调用：tokens(index), mintTimes(address), uri(address)
        for (let i = 0; i < tokenCount; i++) {
            // 获取代币地址
            calls.push({
                target: CONTRACT_CONFIG.FACTORY_CONTRACTV3,
                allowFailure: true,
                callData: factoryInterface.encodeFunctionData("tokens", [i]),
            });
        }

        // 执行第一批multicall获取所有代币地址
        console.log(`执行第一批multicall，获取 ${tokenCount} 个代币地址`);
        const addressResults = await multicallContract.aggregate3(calls);

        // 解析代币地址
        const tokenAddresses: string[] = [];
        addressResults.forEach((result: any, index: number) => {
            if (result.success) {
                try {
                    const [tokenAddress] = factoryInterface.decodeFunctionResult("tokens", result.returnData);
                    tokenAddresses.push(tokenAddress);
                    console.log(`代币 ${index}: ${tokenAddress}`);
                } catch (error) {
                    console.warn(`Failed to decode token address at index ${index}:`, error);
                }
            } else {
                console.warn(`Failed to get token address at index ${index}`);
            }
        });

        if (tokenAddresses.length === 0) {
            return [];
        }

        // 准备第二批multicall调用：获取每个代币的mintTimes和uri
        const tokenInterface = new Interface(TokenABI.abi);
        const detailCalls = [];
        
        for (const address of tokenAddresses) {
            // mintTimes调用 - 调用factory合约
            detailCalls.push({
                target: CONTRACT_CONFIG.FACTORY_CONTRACTV3,
                allowFailure: true,
                callData: factoryInterface.encodeFunctionData("mintTimes", [address]),
            });
            // uri调用 - 调用代币合约本身
            detailCalls.push({
                target: address,
                allowFailure: true,
                callData: tokenInterface.encodeFunctionData("uri", []),
            });
        }

        // 执行第二批multicall获取详细信息
        console.log(`执行第二批multicall，获取 ${tokenAddresses.length} 个代币的详细信息`);
        const detailResults = await multicallContract.aggregate3(detailCalls);

        // 解析结果并组合数据
        const tokensInfo: TokenInfo[] = [];
        for (let i = 0; i < tokenAddresses.length; i++) {
            const address = tokenAddresses[i];
            const mintTimesIndex = i * 2;
            const uriIndex = i * 2 + 1;

            let mintTimes = 0;
            let uri = "";

            // 解析mintTimes
            if (detailResults[mintTimesIndex]?.success) {
                try {
                    const [result] = factoryInterface.decodeFunctionResult("mintTimes", detailResults[mintTimesIndex].returnData);
                    mintTimes = Number(result);
                } catch (error) {
                    console.warn(`Failed to decode mintTimes for ${address}:`, error);
                }
            }

            // 解析uri
            if (detailResults[uriIndex]?.success) {
                try {
                    const [result] = tokenInterface.decodeFunctionResult("uri", detailResults[uriIndex].returnData);
                    uri = result;
                } catch (error) {
                    console.warn(`Failed to decode uri for ${address}:`, error);
                }
            }

            tokensInfo.push({
                address,
                index: i,
                mintTimes,
                uri,
            });

            console.log(`代币 ${i}: ${address}, mintTimes: ${mintTimes}, uri: ${uri}`);
        }

        return tokensInfo;
    } catch (error) {
        console.error("Error in getAllTokensInfo:", error);
        throw error;
    }
};

// 从URI获取代币元数据
const fetchTokenMetadata = async (uri: string): Promise<TokenMetadata | null> => {
    if (!uri || uri === "") {
        return null;
    }

    try {
        console.log(`Fetching metadata from: ${uri}`);
        const response = await fetch(uri);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const metadata = await response.json();
        console.log(`Metadata for ${uri}:`, metadata);
        return metadata;
    } catch (error) {
        console.warn(`Failed to fetch metadata from ${uri}:`, error);
        return null;
    }
};

// 获取代币总数的hook
export const useTokenCount = () => {
    return useQuery({
        queryKey: ["tokenCount"],
        queryFn: getTokenCount,
        staleTime: 30000, // 30秒缓存
        refetchInterval: 60000, // 每分钟刷新一次
    });
};

// 获取所有代币信息的hook
export const useAllTokensInfo = () => {
    return useQuery({
        queryKey: ["allTokensInfo"],
        queryFn: getAllTokensInfo,
        staleTime: 30000, // 30秒缓存
        refetchInterval: 60000, // 每分钟刷新一次
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

// 批量获取代币元数据的hook
export const useBatchTokenMetadata = (tokens: TokenInfo[]) => {
    return useQuery({
        queryKey: ["batchTokenMetadata", tokens.map(t => t.uri).join(",")],
        queryFn: async () => {
            const metadataPromises = tokens.map(async (token) => {
                if (token.uri) {
                    const metadata = await fetchTokenMetadata(token.uri);
                    return { ...token, metadata };
                }
                return token;
            });

            return Promise.all(metadataPromises);
        },
        enabled: tokens.length > 0,
        staleTime: 300000, // 5分钟缓存（元数据相对稳定）
        retry: 2,
    });
};

// 完整的代币数据获取hook（包含元数据）
export const useCompleteTokensData = () => {
    // 首先获取基础代币信息
    const { data: tokensInfo, isLoading: isTokensLoading, error: tokensError } = useAllTokensInfo();

    // 然后获取元数据
    const { data: tokensWithMetadata, isLoading: isMetadataLoading, error: metadataError } = useBatchTokenMetadata(tokensInfo || []);

    return {
        data: tokensWithMetadata,
        isLoading: isTokensLoading || isMetadataLoading,
        error: tokensError || metadataError,
        tokensCount: tokensInfo?.length || 0,
    };
};