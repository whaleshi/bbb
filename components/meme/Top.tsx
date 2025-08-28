import Image from "next/image";
import { useParams } from "next/navigation";
import { shortenAddress } from '@/utils/index'


const Top = ({ metaData, tokenInfo, progressData }: any) => {
    const params = useParams();
    const tokenAddress = params.addr as string;

    return (<div className="w-full pt-[16px]">
        <div className="flex gap-[10px] w-full">
            <Image src={metaData?.image || "/default.png"} alt="logo" width={48} height={48} className="border-1 border-[#F3F3F3] rounded-[0px]" />
            <div className="flex-1 flex flex-col justify-center gap-[4px]">
                <div className="text-[14px] text-[#333] font-medium flex justify-between">
                    <div>{metaData?.symbol || shortenAddress(tokenAddress)}</div>
                    <div>$0.00897812</div>
                </div>
                <div className="text-[12px] text-[#999] flex justify-between">
                    <div>{metaData?.name || '-'}</div>
                    <div>24H <span className="text-[#41CD5A]">+86.98%</span></div>{/* EB4B6D */}
                </div>
            </div>
        </div>
        <div className="h-[40px] w-full bg-[#E8FCEB] mt-[24px] relative">
            <div className="h-full bg-[#41CD5A]" style={{ width: `${progressData.progress}%` }}></div>
            <div className="w-full h-full absolute left-0 top-0 text-[12px] text-[#333] flex items-center justify-center">联合曲线进度 {progressData.progress}%</div>
        </div>
        <div className="flex gap-[12px] h-[54px] mt-[20px]">
            <div className="flex-1 h-full border-1 border-[#F3F3F3] flex items-center flex-col justify-center">
                <div className="text-[12px] text-[#333] font-medium">$18.89M</div>
                <div className="text-[10px] text-[#999] font-medium">市值</div>
            </div>
            <div className="flex-1 h-full border-1 border-[#F3F3F3] flex items-center flex-col justify-center">
                <div className="text-[12px] text-[#333] font-medium">$18.89M</div>
                <div className="text-[10px] text-[#999] font-medium">24H 交易量</div>
            </div>
            <div className="flex-1 h-full border-1 border-[#F3F3F3] flex items-center flex-col justify-center">
                <div className="text-[12px] text-[#333] font-medium">23</div>
                <div className="text-[10px] text-[#999] font-medium">持有者</div>
            </div>
        </div>
        <div className="mt-[40px] text-[#333] text-[16px] text-medium">代币详情</div>
        {
            metaData?.description && <div className="text-[12px] text-[#999] mt-[20px]">{metaData?.description}</div>
        }
        <div className="flex gap-[12px]">
            {
                metaData?.website && <div className="mt-[26px] w-[40px] h-[40px] border-1 border-[#F3F3F3] flex items-center justify-center cursor-pointer"
                    onClick={() => { window.open(metaData?.website, "_blank") }}
                >
                    <Image src="/web.png" width={26} height={26} alt="web" />
                </div>
            }
            {
                metaData?.x && <div className="mt-[26px] w-[40px] h-[40px] border-1 border-[#F3F3F3] flex items-center justify-center cursor-pointer"
                    onClick={() => { window.open(metaData?.x, "_blank") }}
                >
                    <Image src="/x.png" width={26} height={26} alt="x" />
                </div>
            }
            {
                metaData?.telegram && <div className="mt-[26px] w-[40px] h-[40px] border-1 border-[#F3F3F3] flex items-center justify-center cursor-pointer"
                    onClick={() => { window.open(metaData?.telegram, "_blank") }}
                >
                    <Image src="/tg.png" width={26} height={26} alt="tg" />
                </div>
            }
        </div>
        <div className="w-full px-[12px] py-[16px] border-1 border-[#F3F3F3] mt-[20px] text-[12px] text-[#999] flex flex-col gap-[12px]">
            <div className="flex justify-between">
                代币总量<div className="text-[#101010]">10亿</div>
            </div>
            <div className="flex justify-between">
                内盘总量<div className="text-[#101010]">8亿</div>
            </div>
            <div className="flex justify-between">
                内盘进度<div className="text-[#101010]">{progressData.progress}%</div>
            </div>
            <div className="flex justify-between">
                合约地址<div className="text-[#101010]"><span className="underline cursor-pointer">{shortenAddress(tokenAddress)}</span><span className="text-[#999] ml-[4px] cursor-pointer">复制</span></div>
            </div>
            <div className="flex justify-between">
                创建者<div className="text-[#101010] underline cursor-pointer">{shortenAddress(tokenInfo?.creator)}</div>
            </div>
        </div>
    </div>)
}

export default Top;