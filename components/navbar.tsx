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
import { Kbd, Button, Link, Image, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { shortenAddress } from "@/utils";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import SearchDropdown from "@/components/SearchDropdown";
import {
    TwitterIcon,
    GithubIcon,
    DiscordIcon,
    HeartFilledIcon,
    Logo,
} from "@/components/icons";

import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react";
import { useState } from "react";

export const Navbar = () => {
    const { open, close } = useAppKit();
    const { address, isConnected, caipAddress, status, embeddedWalletInfo } = useAppKitAccount();
    const { disconnect } = useDisconnect();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                        运行机制
                    </NextLink>
                    <NextLink href="/create" prefetch={true} className="text-[14px] text-[#101010] hover:text-[#666]">
                        创建代币
                    </NextLink>
                </div>
            </NavbarContent>

            <NavbarContent
                className="hidden sm:flex basis-1/5 sm:basis-full"
                justify="end"
            >
                <NavbarItem className="hidden sm:flex gap-2">
                    <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
                        <TwitterIcon className="text-default-500" />
                    </Link>
                    <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
                        <DiscordIcon className="text-default-500" />
                    </Link>
                    <Link isExternal aria-label="Github" href={siteConfig.links.github}>
                        <GithubIcon className="text-default-500" />
                    </Link>
                    <ThemeSwitch />
                </NavbarItem>
                <NavbarItem className="hidden lg:flex"><SearchDropdown /></NavbarItem>
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
                                    <DropdownItem key="balance" className="h-14 gap-2 rounded-[0px]" textValue="余额">
                                        <div className="flex flex-col">
                                            <p className="text-sm text-[#999]">余额</p>
                                            <p className="text-sm font-semibold text-[#101010]">0 OKB</p>
                                        </div>
                                    </DropdownItem>
                                    <DropdownItem key="address" className="rounded-[0px]" textValue="地址">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-[#101010]">{shortenAddress(address!)}</span>
                                            <span className="text-xs text-[#999] cursor-pointer">复制</span>
                                        </div>
                                    </DropdownItem>
                                    <DropdownItem
                                        key="logout"
                                        className="text-danger rounded-[0px]"
                                        color="danger"
                                        onPress={() => toDisconnect()}
                                        textValue="断开连接"
                                    >
                                        断开连接
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
                            连接钱包
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
                        连接钱包
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
                                <div className="text-[11px] text-[#AAA]">余额</div>
                                <div className="text-[18px] text-[#101010] font-semibold">0 OKB</div>
                            </div>
                            <div
                                onClick={() => { toDisconnect() }}
                                className="w-[48px] h-[32px] flex items-center justify-center bg-[#FDD9ED] text-[11px] text-[#EB4B6D] cursor-pointer"
                            >
                                断开
                            </div>
                        </div>
                        <div className="h-[32px] w-full border-t-[0px] border-[#F3F3F3] border-[1px] flex items-center pl-[16px] gap-[4px]">
                            <div className="text-[11px] text-[#101010] underline cursor-pointer">{shortenAddress(address!)}</div>
                            <div className="text-[11px] text-[#999] cursor-pointer">复制</div>
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
                        运行机制
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
                        创建代币
                    </Button>
                </div>
                <div className="text-[16px] text-[#333] font-bold mt-[10px]">关于我们</div>
                <div className="text-[12px] text-[#999] mt-[10px]">okbro.fun 是构建在 X Layer 上的代币发射台。最初由社区发起，致力于打造兄弟战壕。</div>
                <div className="flex gap-[12px] relative mt-[10px]">
                    <div className="w-[40px] h-[40px] border-1 border-[#F3F3F3] bg-[rgba(64,204,89,0.00)]"></div>
                    <div className="w-[40px] h-[40px] border-1 border-[#F3F3F3] bg-[rgba(64,204,89,0.00)]"></div>
                </div>
            </NavbarMenu>
        </HeroUINavbar>
    );
};
