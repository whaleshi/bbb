import { useState } from "react";
import { Button } from "@heroui/react";
import TradePopup from "@/components/trade/Trade";

const Trade = () => {
	const [isTradePopupOpen, setIsTradePopupOpen] = useState(false);

	return <div>
		<TradePopup
			isOpen={isTradePopupOpen}
			onOpenChange={setIsTradePopupOpen}
		/>
		{/* <Slippage /> */}
		<Button
			radius="none"
			className="w-full h-[48px] bg-[#E8FCEB] border-[#41CD5A] border-1 text-[14px] text-[#41CD5A]"
			onPress={() => setIsTradePopupOpen(true)}
		>
			快速买入 0.5 OKB
		</Button>
		<div className="mt-[12px]">
			<Button
				radius="none"
				className="w-full h-[48px] bg-[#41CD5A] border-[#41CD5A] border-1 text-[14px] text-[#FFF]"
				onPress={() => setIsTradePopupOpen(true)}
			>
				立即买入
			</Button>
		</div>
	</div>;
}

export default Trade;