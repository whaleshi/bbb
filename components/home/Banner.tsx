import React, { useEffect } from "react";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { Image } from "@heroui/react"

const Home = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center pt-[16px]">
            <div className="px-[10px] w-full flex items-center h-[36px] border-1 border-[#F3F3F3] text-[11px]">
                <div className="flex flex-1 items-center text-[#AAA] gap-[4px]">
                    战壕资金<span className="text-[#101010]">18.98OKB</span>
                </div>
                <div className="flex flex-1 items-center text-[#AAA] gap-[4px]">
                    累计资助<span className="text-[#101010]">18.98OKB</span>
                </div>
                <div className="text-[#333]">详情</div>
            </div>

            <div className="relative flex flex-col items-center pt-[20px]">
                <Image src="https://img.js.design/assets/img/68a8cff6bad414f819b93dbc.png" width={160} height={160} alt="" />
                <div className="text-[18px] font-medium text-[#000]">
                    在<span className="font-semibold mx-[4px]">X Layer</span>打造<span className="text-[#41CD5A]">兄弟</span>战壕
                </div>
            </div>
            <div className="w-full px-[16px] mt-[24px] md:mt-[32px] flex justify-center gap-[12px]">
                <Button className="h-[48px] border border-solid border-[#F3F3F3] w-[150px] md:w-[180px] bg-[#FFF]  text-[#0E0E0E] f600" radius="none">
                    运行机制
                </Button>
                <Button
                    className="h-[48px] opacity-100 bg-[#101010] text-[#fff]  w-[150px] md:w-[180px]"
                    radius="none"
                    onPress={() => router.push('/create')}
                >
                    创建代币
                </Button>
            </div>
        </div>
    );
};

export default Home;
