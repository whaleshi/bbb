"use client";
import React, { useState } from "react";
import { Input, Button, useDisclosure } from "@heroui/react";

import ResponsiveDialog from "../common/ResponsiveDialog";

interface SlippageProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CreateForm({ isOpen = false, onOpenChange }: SlippageProps) {
  const [active, setIsBuy] = useState(0);

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      maxVH={70}
      size="md"
      title="设置"
    >
      <div className="text-base text-[#101010] pb-[5px]">
        Slippage Tolerance
      </div>
      <div className="flex items-center justify-between ">
        <button
          className={` w-[30%] rounded-[10px] h-[45px]   border border-solid  ${active === 0 ? "bg-[#E8FCEB] border-[#41CD5A]" : "bg-[#f3f3f3] border-[#f3f3f3] "}`}
        >
          1%
        </button>
        <button
          className={` w-[30%] rounded-[10px] h-[45px]  border border-solid   ${active === 1 ? "bg-[#E8FCEB] border-[#41CD5A]" : "bg-[#f3f3f3] border-[#f3f3f3] "}`}
        >
          3%
        </button>
        <button
          className={` w-[30%] rounded-[10px] h-[45px]  border border-solid   ${active === 2 ? "bg-[#E8FCEB] border-[#41CD5A]" : "bg-[#f3f3f3] border-[#f3f3f3] "}`}
        >
          5%
        </button>
      </div>
      <div>
        <Input
          classNames={{
            inputWrapper:
              "px-[18px] py-3.5 rounded-none border-[#F3F3F3] h-[52]",
            input: "text-center",
          }}
          labelPlacement="outside"
          placeholder="自定义"
          variant="bordered"
        />
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
