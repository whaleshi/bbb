"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@heroui/react";

function useIsMobile(query = "(max-width: 768px)") {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile("matches" in e ? e.matches : (e as MediaQueryList).matches);
    handler(mql);
    if ("addEventListener" in mql)
      mql.addEventListener("change", handler as any);
    else (mql as any).addListener(handler);
    return () => {
      if ("removeEventListener" in mql)
        mql.removeEventListener("change", handler as any);
      else (mql as any).removeListener(handler);
    };
  }, [query]);
  return isMobile;
}

export type ResponsiveDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** 右上角自定义关闭按钮（不传则用默认的 X） */
  closeButton?: React.ReactNode;
  /** 最⼤高度（默认 70vh） */
  maxVH?: number; // e.g. 70
  /** 可覆写样式 */
  classNames?: {
    content?: string;
    header?: string;
    body?: string;
  };
  /** PC 弹窗的 width 尺寸（不影响移动端） */
  size?:
  | "2xl"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full"
  | "xs"
  | "3xl"
  | "4xl"
  | "5xl"
  | "full";
};

export default function ResponsiveDialog({
  isOpen,
  onOpenChange,
  title,
  children,
  closeButton,
  maxVH = 70,
  classNames,
  size = "md",
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();
  const maxHeightStyle = { maxHeight: `${maxVH}vh` };

  const DefaultClose = !closeButton && (
    <button
      type="button"
      aria-label="close"
      onClick={() => onOpenChange(false)}
      className="absolute grid w-8 h-8 rounded-[0px] cursor-pointer right-3 top-3 place-items-center"
    >
      <CloseIcon />
    </button>
  );

  if (isMobile) {
    return (
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom"
        hideCloseButton
        isDismissable={false}
        classNames={{ backdrop: "bg-black/60" }}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: { type: "spring", damping: 25, stiffness: 300 },
            },
            exit: { y: 40, opacity: 0, transition: { duration: 0.18 } },
          },
        }}
      >
        <DrawerContent
          className={[
            "bg-[#fff] text-foreground rounded-[0px]",
            classNames?.content || "",
          ].join(" ")}
          style={maxHeightStyle}
        >
          <DrawerHeader
            className={[
              "relative px-4 pt-4 pb-2 flex justify-center items-center",
              classNames?.header || "",
            ].join(" ")}
          >
            <div className="text-[17px] text-[#101010] f500 text-center">
              {title}
            </div>
            {DefaultClose}
          </DrawerHeader>

          <DrawerBody
            className={["px-4 pb-4 overflow-auto", classNames?.body || ""].join(
              " "
            )}
            style={{ ...maxHeightStyle }}
          >
            {children}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      size={size}
      hideCloseButton
      isDismissable={false}
      classNames={{ backdrop: "bg-black/60" }}
    >
      <ModalContent
        className={[
          "bg-[#fff] text-foreground rounded-[0px] border border-[#383838]",
          classNames?.content || "",
        ].join(" ")}
        // 让整个内容体受最大高度限制
        style={maxHeightStyle}
      >
        <ModalHeader
          className={[
            "relative flex justify-center items-center px-[16px]",
            classNames?.header || "",
          ].join(" ")}
        >
          <div className="text-[17px] text-[#101010] f500 text-center">
            {title}
          </div>
          {DefaultClose}
        </ModalHeader>

        <ModalBody
          className={["px-[16px] overflow-auto", classNames?.body || ""].join(
            " "
          )}
          style={maxHeightStyle}
        >
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M18.0136 6.70022C18.2089 6.89548 18.2089 7.21206 18.0136 7.40733L13.7676 11.6533C13.5724 11.8486 13.5724 12.1652 13.7676 12.3605L18.0068 16.5996C18.2021 16.7949 18.2021 17.1115 18.0068 17.3067L17.2998 18.0137C17.1046 18.209 16.788 18.209 16.5927 18.0137L12.3536 13.7745C12.1583 13.5793 11.8417 13.5793 11.6464 13.7745L7.40726 18.0137C7.212 18.209 6.89542 18.209 6.70016 18.0137L5.9932 17.3067C5.79794 17.1115 5.79794 16.7949 5.9932 16.5996L10.2324 12.3605C10.4276 12.1652 10.4276 11.8486 10.2324 11.6533L5.98637 7.40733C5.7911 7.21206 5.7911 6.89548 5.98637 6.70022L6.69332 5.99326C6.88858 5.798 7.20517 5.798 7.40043 5.99326L11.6464 10.2393C11.8417 10.4345 12.1583 10.4345 12.3536 10.2393L16.5996 5.99326C16.7948 5.798 17.1114 5.798 17.3067 5.99326L18.0136 6.70022Z"
      fill="#4D4B62"
    />
  </svg>
);
