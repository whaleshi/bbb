"use client";

import React from "react";
import { 
    Card, 
    CardBody, 
    CardHeader,
    Skeleton, 
    Button, 
    Chip,
    Image,
    Progress
} from "@heroui/react";
import { useCompleteTokensData, type TokenInfo } from "@/hooks/useTokenData";

// 单个代币卡片组件
const TokenCard: React.FC<{ token: TokenInfo }> = ({ token }) => {
    const progress = Math.min((token.mintTimes / 800) * 100, 100); // 假设800为目标mint次数
    
    return (
        <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                    <Image
                        src={token.metadata?.image || "/default-token.png"}
                        alt={token.metadata?.name || "Unknown Token"}
                        className="w-12 h-12 rounded-full"
                        fallbackSrc="/default-token.png"
                    />
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold">
                            {token.metadata?.name || "Unknown Token"}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {token.metadata?.symbol || "N/A"}
                        </p>
                    </div>
                </div>
            </CardHeader>
            
            <CardBody className="pt-2">
                {/* 代币描述 */}
                {token.metadata?.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {token.metadata.description}
                    </p>
                )}
                
                {/* 代币地址 */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-400">地址:</span>
                    <Chip size="sm" variant="flat" className="text-xs">
                        {token.address.slice(0, 6)}...{token.address.slice(-4)}
                    </Chip>
                </div>

                {/* Mint次数 */}
                <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Mint次数</span>
                        <span className="text-sm font-medium">{token.mintTimes}</span>
                    </div>
                    <Progress 
                        value={progress} 
                        className="h-2"
                        color={progress >= 100 ? "success" : "primary"}
                        classNames={{
                            indicator: progress >= 100 ? "bg-success" : "bg-primary"
                        }}
                    />
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-400">进度</span>
                        <span className="text-xs font-medium">{progress.toFixed(1)}%</span>
                    </div>
                </div>

                {/* 状态标签 */}
                <div className="flex gap-2 mb-4">
                    {progress >= 100 ? (
                        <Chip size="sm" color="success" variant="flat">
                            已开盘
                        </Chip>
                    ) : (
                        <Chip size="sm" color="primary" variant="flat">
                            预热中
                        </Chip>
                    )}
                    {token.uri && (
                        <Chip size="sm" color="secondary" variant="flat">
                            有元数据
                        </Chip>
                    )}
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                    <Button 
                        size="sm" 
                        color="primary" 
                        variant="flat"
                        className="flex-1"
                        onPress={() => window.open(`/token/${token.address}`, '_blank')}
                    >
                        查看详情
                    </Button>
                    {token.uri && (
                        <Button 
                            size="sm" 
                            color="secondary" 
                            variant="flat"
                            onPress={() => window.open(token.uri, '_blank')}
                        >
                            元数据
                        </Button>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

// 骨架屏组件
const TokenCardSkeleton: React.FC = () => (
    <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
        </CardHeader>
        <CardBody>
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-24 mb-3" />
            <div className="mb-3">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-2 w-full mb-1" />
                <Skeleton className="h-3 w-12" />
            </div>
            <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 w-16" />
            </div>
        </CardBody>
    </Card>
);

// 主要的代币列表组件
const TokenList: React.FC = () => {
    const { data: tokens, isLoading, error, tokensCount } = useCompleteTokensData();

    // 重新获取数据
    const handleRefresh = () => {
        window.location.reload(); // 简单的刷新方式
    };

    if (error) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <Card className="border-danger">
                    <CardBody className="p-6 text-center">
                        <div className="text-danger text-lg font-semibold mb-2">
                            获取代币列表失败
                        </div>
                        <p className="text-gray-600 mb-4">
                            {error instanceof Error ? error.message : "未知错误"}
                        </p>
                        <Button color="danger" onPress={handleRefresh}>
                            重新加载
                        </Button>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* 头部信息 */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">代币列表</h1>
                    <p className="text-gray-600">
                        {isLoading ? "正在加载..." : `共找到 ${tokensCount} 个代币`}
                    </p>
                </div>
                <Button 
                    onPress={handleRefresh} 
                    disabled={isLoading}
                    color="primary"
                    variant="flat"
                >
                    {isLoading ? "加载中..." : "刷新"}
                </Button>
            </div>

            {/* 统计卡片 */}
            {tokens && !isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardBody className="text-center">
                            <div className="text-2xl font-bold text-primary mb-1">
                                {tokensCount}
                            </div>
                            <div className="text-sm text-gray-600">总代币数</div>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody className="text-center">
                            <div className="text-2xl font-bold text-success mb-1">
                                {tokens.filter(t => t.mintTimes >= 800).length}
                            </div>
                            <div className="text-sm text-gray-600">已开盘</div>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody className="text-center">
                            <div className="text-2xl font-bold text-warning mb-1">
                                {tokens.filter(t => t.mintTimes > 0 && t.mintTimes < 800).length}
                            </div>
                            <div className="text-sm text-gray-600">预热中</div>
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* 代币网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    // 加载骨架屏
                    Array.from({ length: 6 }).map((_, index) => (
                        <TokenCardSkeleton key={index} />
                    ))
                ) : tokens && tokens.length > 0 ? (
                    // 代币列表
                    tokens.map((token) => (
                        <TokenCard key={token.address} token={token} />
                    ))
                ) : (
                    // 空状态
                    <div className="col-span-full">
                        <Card>
                            <CardBody className="p-12 text-center">
                                <div className="text-6xl mb-4">🪙</div>
                                <div className="text-xl font-semibold text-gray-600 mb-2">
                                    暂无代币
                                </div>
                                <p className="text-gray-500">
                                    当前没有找到任何代币，请稍后再试
                                </p>
                            </CardBody>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TokenList;