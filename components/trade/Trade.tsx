"use client";
import React, { useState } from "react";
import { Input, Button, useDisclosure } from "@heroui/react";
import Slippage from "@/components/trade/Slippage";

import ResponsiveDialog from "../common/ResponsiveDialog";

interface TradeProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function Trade({ isOpen = false, onOpenChange }: TradeProps) {
  const [buy, setIsBuy] = useState(true);
  const [isSlippageOpen, setIsSlippageOpen] = useState(false);

  return (
    <div>
      <Slippage isOpen={isSlippageOpen} onOpenChange={setIsSlippageOpen} />
      <ResponsiveDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange ?? (() => { })}
        maxVH={70}
        size="md"
        classNames={{ body: "text-[#fff]" }}
        title={
          <div className="flex items-center justify-start w-screen">
            <div className="flex start gap-[16px]  px-[16px] text-[16px] text-[#67646B]">
              <div
                className={
                  buy
                    ? "text-[#101010] f600 cursor-pointer"
                    : "cursor-pointer text-[#999]"
                }
                onClick={() => setIsBuy(true)}
              >
                买入
              </div>
              <div
                className={
                  !buy
                    ? "text-[#101010] f600 cursor-pointer"
                    : "cursor-pointer text-[#999]"
                }
                onClick={() => setIsBuy(false)}
              >
                卖出
              </div>
            </div>
          </div>
        }
      >
        <div>
          <Input
            classNames={{
              inputWrapper:
                "px-[18px] py-3.5 rounded-none border-[#F3F3F3] h-[52]",
            }}
            labelPlacement="outside"
            placeholder="0.00"
            variant="bordered"
            endContent={
              <span className="text-sm font-medium text-[#101010]">OKB</span>
            }
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Button radius="none" className="bg-[#f3f3f3]">
            0.1OKB
          </Button>
          <Button radius="none" className="bg-[#f3f3f3]">
            0.2OKB
          </Button>
          <Button radius="none" className="bg-[#f3f3f3]">
            0.3OKB
          </Button>
          <Button radius="none" className="bg-[#f3f3f3]">
            更多
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#EB4B6D] text-xs">
            * 内盘单钱包最多支持买入 0.5 OKB
          </span>
          <span className="text-[#999] text-xs">
            余额 <i className="text-[#101010]  not-italic">0.0 OKB</i>
          </span>
        </div>
        <div>
          <div className="text-base font-medium text-[rgba(16,16,16,1)] pb-[13px]">
            预计获得
          </div>
          <Input
            classNames={{
              inputWrapper:
                "px-[18px] py-3.5 rounded-none border-[#F3F3F3] h-[52]",
            }}
            labelPlacement="outside"
            placeholder="0.00"
            variant="bordered"
            endContent={
              <span className="text-sm font-medium text-[#101010]">OKBRO</span>
            }
          />
        </div>
        {buy ? (
          <Button radius="none" className="bg-[#41CD5A] text-[#fff] h-[48px]">
            立即买入
          </Button>
        ) : (
          <Button radius="none" className="bg-[#EB4B6D] text-[#fff] h-[48px]">
            立即卖出
          </Button>
        )}

        <div className="border p-4 border-solid border-[#F3F3F3]">
          <div className="flex items-center justify-between text-xs pb-[12px]">
            <span className="text-[#999] ">交易滑点</span>
            <span className="text-[#999]">
              <i className="line-through not-italic text-[#101010]">7.89% </i>
              <span 
                className="cursor-pointer hover:text-[#41CD5A]" 
                onClick={() => setIsSlippageOpen(true)}
              >
                设置
              </span>
            </span>
          </div>
          <div className="flex items-center justify-between text-xs  pb-[12px]">
            <span className="text-[#999]">已买入</span>
            <span className="text-[#101010]">7.89%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#999]">剩余可买</span>
            <span className="text-[#101010]">7.89%</span>
          </div>
        </div>
      </ResponsiveDialog>
    </div>
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
