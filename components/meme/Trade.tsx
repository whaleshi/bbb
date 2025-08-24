import { useState } from "react";
import { Button } from "@heroui/react";
import TradePopup from "@/components/trade/Trade";

const Trade = () => {
    const [isTradePopupOpen, setIsTradePopupOpen] = useState(false);
    const [tradeMode, setTradeMode] = useState(true); // true for buy, false for sell

    return <div className="pb-[30px]">
        <TradePopup
            isOpen={isTradePopupOpen}
            onOpenChange={setIsTradePopupOpen}
            initialMode={tradeMode}
        />
        {/* <Slippage /> */}
        <Button
            radius="none"
            className="w-full h-[48px] bg-[#E8FCEB] border-[#41CD5A] border-1 text-[14px] text-[#41CD5A]"
            onPress={() => {

            }}
        >
            快速买入 0.5 OKB
        </Button>
        <div className="mt-[12px] flex gap-[12px]">
            <Button
                radius="none"
                className="w-full h-[48px] bg-[#EB4B6D] border-[#EB4B6D] border-1 text-[14px] text-[#FFF]"
                onPress={() => {
                    setTradeMode(false); // 设置为卖出模式
                    setIsTradePopupOpen(true);
                }}
            >
                卖出
            </Button>
            <Button
                radius="none"
                className="w-full h-[48px] bg-[#41CD5A] border-[#41CD5A] border-1 text-[14px] text-[#FFF]"
                onPress={() => {
                    setTradeMode(true); // 设置为买入模式
                    setIsTradePopupOpen(true);
                }}
            >
                立即买入
            </Button>
        </div>
    </div>;
}

export default Trade;