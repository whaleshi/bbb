'use client';

import React, { useState, useRef, useEffect } from "react";
import { Input, Card, CardBody, Image } from "@heroui/react";
import { SearchIcon } from "@/components/icons";
import Link from "next/link";

interface SearchResult {
    id: string;
    symbol: string;
    name?: string;
    image?: string;
}

export default function SearchDropdown() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // 获取代币数据进行搜索
    const tokens = []
    const isLoading = false

    // 模拟搜索结果数据
    const mockResults: SearchResult[] = [
        { id: "1", symbol: "DOGE", name: "Dogecoin", image: "/default.png" },
        { id: "2", symbol: "PEPE", name: "Pepe Token", image: "/default.png" },
        { id: "3", symbol: "SHIB", name: "Shiba Inu", image: "/default.png" },
        { id: "4", symbol: "BONK", name: "Bonk Token", image: "/default.png" },
    ];

    // 搜索逻辑
    // useEffect(() => {
    //     if (searchQuery.trim() === "") {
    //         setFilteredResults([]);
    //         setIsOpen(false);
    //         return;
    //     }

    //     // 使用真实数据或模拟数据进行搜索
    //     const dataToSearch = tokens && tokens.length > 0 ?
    //         tokens.map(token => ({
    //             id: token.id || "1",
    //             symbol: token.symbol || "",
    //             name: token.name || token.symbol,
    //             image: "/default.png"
    //         })) : mockResults;

    //     const filtered = dataToSearch.filter(item =>
    //         item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //         (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    //     );

    //     setFilteredResults(filtered.slice(0, 8)); // 限制显示8个结果
    //     setIsOpen(filtered.length > 0);
    // }, [searchQuery, tokens]);

    // 点击外部关闭下拉框
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInputChange = (value: string) => {
        setSearchQuery(value);
    };

    const handleResultClick = () => {
        setIsOpen(false);
        setSearchQuery("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div className="relative w-full max-w-[300px]" ref={searchRef}>
            <Input
                ref={inputRef}
                aria-label="Search tokens"
                radius="none"
                classNames={{
                    inputWrapper: "bg-default-100 hover:bg-default-200 transition-colors rounded-none",
                    input: "text-sm",
                }}
                labelPlacement="outside"
                placeholder="搜索代币..."
                startContent={
                    <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
                }
                type="search"
                value={searchQuery}
                onValueChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                    if (searchQuery && filteredResults.length > 0) {
                        setIsOpen(true);
                    }
                }}
            />

            {isOpen && filteredResults.length > 0 && (
                <Card radius="none" className="absolute top-full left-0 right-0 mt-1 z-50 border border-default-200 shadow-lg max-h-[400px] overflow-y-auto rounded-none">
                    <CardBody className="p-0">
                        {filteredResults.map((result) => (
                            <Link
                                key={result.id}
                                href={`/meme/${result.id}`}
                                onClick={handleResultClick}
                                className="flex items-center gap-3 p-3 hover:bg-default-100 transition-colors border-b border-default-100 last:border-b-0"
                            >
                                <Image
                                    src={result.image || "/default.png"}
                                    alt={result.symbol}
                                    className="w-8 h-8 rounded-none border border-default-200 shrink-0"
                                    fallbackSrc="/default.png"
                                />
                                <div className="flex flex-col">
                                    <div className="text-sm font-medium text-foreground">
                                        {result.symbol}
                                    </div>
                                    {result.name && result.name !== result.symbol && (
                                        <div className="text-xs text-default-500">
                                            {result.name}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                        {isLoading && (
                            <div className="p-3 text-center text-sm text-default-500">
                                搜索中...
                            </div>
                        )}
                    </CardBody>
                </Card>
            )}

            {isOpen && searchQuery && filteredResults.length === 0 && !isLoading && (
                <Card radius="none" className="absolute top-full left-0 right-0 mt-1 z-50 border border-default-200 shadow-lg rounded-none">
                    <CardBody className="p-4 text-center">
                        <div className="text-sm text-default-500">
                            未找到相关代币
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}