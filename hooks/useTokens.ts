import { useQuery } from "@tanstack/react-query";
import { getTokens, getToken } from "../utils/queries";

// 获取代币列表的 hook
export const useTokens = (variables?: { first?: number; skip?: number; orderBy?: string; orderDirection?: string }) => {
    return useQuery({
        queryKey: ["tokens", variables],
        queryFn: () => getTokens(variables),
        refetchInterval: 3000, // 每3秒自动刷新
        staleTime: 5000, // 5秒缓存
    });
};

// 获取单个代币的 hook
export const useToken = (id: string) => {
    return useQuery({
        queryKey: ["token", id],
        queryFn: () => getToken(id),
        enabled: !!id,
        staleTime: 60000, // 1分钟缓存
    });
};
