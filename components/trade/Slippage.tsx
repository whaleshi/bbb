"use client";
import React, { useState } from "react";
import { Input, Button, useDisclosure } from "@heroui/react";

import ResponsiveDialog from "../common/ResponsiveDialog";

interface SlippageProps {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function Slippage({ isOpen = false, onOpenChange }: SlippageProps) {
    const [activeSlippage, setActiveSlippage] = useState(0);
    const [customSlippage, setCustomSlippage] = useState("");

    const slippageOptions = [
        { id: 0, label: "1%", value: 1 },
        { id: 1, label: "3%", value: 3 },
        { id: 2, label: "5%", value: 5 }
    ];

    return (
        <ResponsiveDialog
            isOpen={isOpen}
            onOpenChange={onOpenChange ?? (() => { })}
            maxVH={70}
            size="md"
            title="设置"
        >
            <div className="text-base text-[#101010] pb-[5px]">
                Slippage Tolerance
            </div>
            <div className="flex items-center justify-between gap-[12px] mb-[16px]">
                {slippageOptions.map((option) => (
                    <Button
                        key={option.id}
                        radius="none"
                        className={`flex-1 h-[45px] text-[14px] ${activeSlippage === option.id
                            ? "bg-[#E8FCEB] border-[#41CD5A] text-[#41CD5A]"
                            : "bg-[#F3F3F3] border-[#F3F3F3] text-[#101010]"
                            }`}
                        variant="bordered"
                        onPress={() => {
                            setActiveSlippage(option.id);
                            setCustomSlippage("");
                        }}
                    >
                        {option.label}
                    </Button>
                ))}
            </div>
            <div>
                <Input
                    classNames={{
                        inputWrapper:
                            "px-[18px] py-3.5 rounded-none border-[1px] border-[#F3F3F3] h-[52]",
                        input: "text-[14px] text-[#101010] placeholder:text-[#999] text-center",
                    }}
                    labelPlacement="outside"
                    placeholder="自定义滑点"
                    variant="bordered"
                    value={customSlippage}
                    onChange={(e) => {
                        setCustomSlippage(e.target.value);
                        setActiveSlippage(-1); // 清除预设选择
                    }}
                    endContent={
                        <span className="text-[14px] font-medium text-[#101010]">%</span>
                    }
                />
            </div>

            <div className="flex gap-[12px] my-[12px]">
                <Button
                    radius="none"
                    className="flex-1 h-[48px] text-[14px] bg-[#41CD5A] text-white"
                    onPress={() => {
                        // 这里可以添加保存滑点设置的逻辑
                        console.log('保存滑点:', activeSlippage >= 0 ? slippageOptions[activeSlippage].value : customSlippage);
                        onOpenChange?.(false);
                    }}
                >
                    确认
                </Button>
            </div>
        </ResponsiveDialog>
    );
}

type IconProps = {
    size?: number;
    height?: number;
    width?: number;
    [x: string]: any;
};

export const CopyIcon = ({ size, height, width, ...props }: IconProps) => {
    return (
        <svg
            fill="none"
            height={size || height || 12}
            shapeRendering="geometricPrecision"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            width={size || width || 12}
            {...props}
        >
            <path d="M6 17C4.89543 17 4 16.1046 4 15V5C4 3.89543 4.89543 3 6 3H13C13.7403 3 14.3866 3.4022 14.7324 4M11 21H18C19.1046 21 20 20.1046 20 19V9C20 7.89543 19.1046 7 18 7H11C9.89543 7 9 7.89543 9 9V19C9 20.1046 9.89543 21 11 21Z" />
        </svg>
    );
};

export const CheckIcon = ({ size, height, width, ...props }: IconProps) => {
    return (
        <svg
            fill="currentColor"
            height={size || height || 12}
            viewBox="0 0 24 24"
            width={size || width || 12}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="m2.394 13.742 4.743 3.62 7.616-8.704-1.506-1.316-6.384 7.296-3.257-2.486zm19.359-5.084-1.506-1.316-6.369 7.279-.753-.602-1.25 1.562 2.247 1.798z" />
        </svg>
    );
};
