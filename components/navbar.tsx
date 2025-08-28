'use client'
import {
    Navbar as HeroUINavbar,
    NavbarContent,
    NavbarMenu,
    NavbarMenuToggle,
    NavbarBrand,
    NavbarItem,
    NavbarMenuItem,
} from "@heroui/navbar";
import { Kbd, Button, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import { shortenAddress } from "@/utils";
import Image from "next/image";
import { siteConfig } from "@/config/site";

import { useAppKit, useAppKitAccount, useDisconnect, useAppKitProvider } from "@reown/appkit/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { DEFAULT_CHAIN_CONFIG } from "@/config/chains";

export const Navbar = () => {
    const { open, close } = useAppKit();
    const { address, isConnected, caipAddress, status, embeddedWalletInfo } = useAppKitAccount();
    const { disconnect } = useDisconnect();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 获取钱包余额，3秒刷新一次
    const { data: walletBalance, isLoading: balanceLoading } = useQuery({
        queryKey: ['walletBalance', address],
        queryFn: async () => {
            if (!isConnected || !address) {
                return '0';
            }

            try {
                const provider = new ethers.JsonRpcProvider(DEFAULT_CHAIN_CONFIG.rpcUrl);
                const balance = await provider.getBalance(address);
                // 返回格式化的余额（18位小数）
                return ethers.formatEther(balance);
            } catch (error) {
                console.error('获取钱包余额失败:', error);
                return '0';
            }
        },
        enabled: !!(isConnected && address), // 只有在钱包连接且有地址时才执行查询
        refetchInterval: 10000, // 每3秒刷新一次余额
        staleTime: 8000, // 2秒内的数据认为是新鲜的
        retry: 2, // 失败时重试2次
    });

    // 格式化余额显示
    const formatBalance = (balance: string) => {
        const num = parseFloat(balance);
        if (num === 0) return '0 OKB';
        if (num < 0.001) return '<0.001 OKB';
        if (num < 1) return `${num.toFixed(3)} OKB`;
        if (num < 1000) return `${num.toFixed(2)} OKB`;
        return `${(num / 1000).toFixed(2)}K OKB`;
    };

    const toDisconnect = () => {
        disconnect();
        setIsMenuOpen(false);
    }

    return (
        <HeroUINavbar maxWidth="xl" position="static" height="56px" className="border-b-[1px] border-[#F3F3F3] !px-0 fixed top-0 left-0 right-0 z-50 bg-white" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent className="basis-1/5 sm:basis-full !px-0" justify="start">
                <NavbarBrand as="li" className="gap-3 max-w-fit">
                    <NextLink className="flex justify-start items-center gap-[12px]" href="/">
                        <Image src="/headerLogo.png" alt="logo" width={40} height={40} className="rounded-[0px]" />
                        <p className="font-bold text-inherit">OKBRO</p>
                    </NextLink>
                </NavbarBrand>
                <div className="hidden md:flex gap-[24px] ml-[24px]">
                    <NextLink href="#" className="text-[14px] text-[#101010] hover:text-[#666]">
                        戰壕機制
                    </NextLink>
                    <NextLink href="/create" prefetch={true} className="text-[14px] text-[#101010] hover:text-[#666]">
                        鑄造代幣
                    </NextLink>
                </div>
            </NavbarContent>

            <NavbarContent
                className="hidden sm:flex basis-1/5 sm:basis-full"
                justify="end"
            >
                <NavbarItem className="hidden sm:flex gap-2">
                    <Link isExternal aria-label="x" href={siteConfig.links.x}>
                        <Image src="/x.png" width={36} height={36} alt="x" />
                    </Link>
                    <Link isExternal aria-label="tg" href={siteConfig.links.tg}>
                        <Image src="/tg.png" width={36} height={36} alt="tg" />
                    </Link>
                </NavbarItem>
                <NavbarItem className="hidden md:flex">
                    {
                        isConnected ? (
                            <Dropdown placement="bottom-end" classNames={{ content: "rounded-[0px]" }}>
                                <DropdownTrigger>
                                    <div className="h-[40px] px-[12px] border-1 border-[#F3F3F3] rounded-[0px] flex items-center justify-center cursor-pointer hover:bg-[#F9F9F9]">
                                        {shortenAddress(address!)}
                                    </div>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Profile Actions" variant="faded" className="rounded-[0px]">
                                    <DropdownItem key="balance" className="h-14 gap-2 rounded-[0px]" textValue="餘額">
                                        <div className="flex flex-col">
                                            <p className="text-sm text-[#999]">餘額</p>
                                            <p className="text-sm font-semibold text-[#101010]">
                                                {balanceLoading ? '載入中...' : formatBalance(walletBalance || '0')}
                                            </p>
                                        </div>
                                    </DropdownItem>
                                    <DropdownItem key="address" className="rounded-[0px]" textValue="地址">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-[#101010]">{shortenAddress(address!)}</span>
                                            <span className="text-xs text-[#999] cursor-pointer">複製</span>
                                        </div>
                                    </DropdownItem>
                                    <DropdownItem
                                        key="logout"
                                        className="text-danger rounded-[0px]"
                                        color="danger"
                                        onPress={() => toDisconnect()}
                                        textValue="斷開連接"
                                    >
                                        斷開連接
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        ) : <Button
                            isExternal
                            as={Link}
                            radius="none"
                            className="h-[40px] text-sm font-normal text-[13px] text-[#FFF] bg-[#000]"
                            variant="flat"
                            onPress={() => open()}
                        >
                            連接戰壕
                        </Button>
                    }
                </NavbarItem>
            </NavbarContent>

            <NavbarContent className="sm:hidden basis-1 pl-4 gap-[10px]" justify="end">
                {
                    isConnected ? <div
                        onClick={() => {
                            setIsMenuOpen(true);
                        }}
                        className="h-[40px] px-[12px] border-1 border-[#F3F3F3] flex items-center justify-center">
                        {shortenAddress(address!)}
                    </div> : <Button
                        isExternal
                        as={Link}
                        radius="none"
                        className="h-[40px] text-sm font-normal text-[13px] text-[#FFF] bg-[#000]"
                        variant="flat"
                        onPress={() => { open(); }}
                    >
                        連接戰壕
                    </Button>
                }
                <div className="w-[40px] h-[40px] border-1 border-[#F3F3F3] flex items-center justify-center">
                    <NavbarMenuToggle />
                </div>
            </NavbarContent>
            <NavbarMenu className="px-[16px]">
                {
                    isConnected && <div>
                        <div className="w-full border-[#F3F3F3] border-[1px] h-[76px] px-[16px] flex justify-between items-center">
                            <div className="flex flex-col justify-center h-full">
                                <div className="text-[11px] text-[#AAA]">餘額</div>
                                <div className="text-[18px] text-[#101010] font-semibold">
                                    {balanceLoading ? '載入中...' : formatBalance(walletBalance || '0')}
                                </div>
                            </div>
                            <div
                                onClick={() => { toDisconnect() }}
                                className="w-[48px] h-[32px] flex items-center justify-center bg-[#FDD9ED] text-[11px] text-[#EB4B6D] cursor-pointer"
                            >
                                斷開
                            </div>
                        </div>
                        <div className="h-[32px] w-full border-t-[0px] border-[#F3F3F3] border-[1px] flex items-center pl-[16px] gap-[4px]">
                            <div className="text-[11px] text-[#101010] underline cursor-pointer">{shortenAddress(address!)}</div>
                            <div className="text-[11px] text-[#999] cursor-pointer">複製</div>
                        </div>
                    </div>
                }
                <div className="flex w-full gap-[12px] mt-[10px]">
                    <Button
                        fullWidth
                        isExternal
                        as={Link}
                        radius="none"
                        className="h-[48px] text-sm font-normal text-[#333] bg-[#fff] border-1 border-[#F3F3F3] text-[14px]"
                        variant="flat"
                        onPress={() => open()}
                    >
                        戰壕機制
                    </Button>
                    <Button
                        fullWidth
                        isExternal
                        as={Link}
                        radius="none"
                        className="h-[48px] text-sm font-normal text-[#FFF] bg-[#101010] text-[14px]"
                        variant="flat"
                        onPress={() => open()}
                    >
                        鑄造代幣
                    </Button>
                </div>
                <div className="text-[16px] text-[#333] font-bold mt-[10px]">關於我們</div>
                <div className="text-[12px] text-[#999] mt-[10px]">okbro.fun 是建造在 X Layer 上的代幣發射台。最初由社區發起，致力於打造兄弟戰壕。</div>
                <div className="flex gap-[12px] relative mt-[10px]">
                    <Link isExternal aria-label="x" href={siteConfig.links.x}>
                        <div className="w-[40px] h-[40px] border-1 border-[#F3F3F3] bg-[rgba(64,204,89,0.00)] flex items-center justify-center cursor-pointer">
                            <Image src="/x.png" width={26} height={26} alt="x" />
                        </div>
                    </Link>
                    <Link isExternal aria-label="tg" href={siteConfig.links.tg}>
                        <div className="w-[40px] h-[40px] border-1 border-[#F3F3F3] bg-[rgba(64,204,89,0.00)] flex items-center justify-center cursor-pointer">
                            <Image src="/tg.png" width={26} height={26} alt="tg" />
                        </div>
                    </Link>
                </div>
            </NavbarMenu>
        </HeroUINavbar>
    );
};
