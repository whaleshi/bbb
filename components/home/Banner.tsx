import React, { useEffect } from "react";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center pt-[16px]">
      <div className="px-[10px] w-full flex items-center justify-between opacity-100 border h-[36px] border-solid border-[rgba(243,243,243,1)]">
        <div>
          <span className="text-[11px] font-medium text-[rgba(170,170,170,1)]">
            战壕资金
          </span>
          <span className="text-[11px] ml-2.5 font-medium text-[rgba(16,16,16,1)]">
            18.98OKB
          </span>
        </div>
        <div>
          <span className="text-[11px] font-medium text-[rgba(170,170,170,1)]">
            战壕资金
          </span>
          <span className="text-[11px]  ml-2.5 font-medium text-[rgba(16,16,16,1)]">
            18.98OKB
          </span>
        </div>
        <div className="text-[11px] font-medium text-[rgba(16,16,16,1)]">
          详情
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-between">
        {/* <div
          className="absolute w-full w-100 h-100 z-1 mix-blend-overlay opacity-60 "
          style={{
            background:
              "url(https://img.js.design/assets/img/622ee8fe2d3b1b13ece3bd1d.png)",
          }}
        ></div> */}
        <img
          className="w-40 h-40"
          src="https://img.js.design/assets/img/68a8cff6bad414f819b93dbc.png"
          alt=""
        />
        <div className="text-lg font-medium tracking-[0px] leading-[25.2px] text-black">
          在X Layer 打造<span className="text-[#41CD5A]">兄弟</span>战壕
        </div>
      </div>

      <div className="w-full px-[16px] mt-[23px] md:mt-[32px] flex justify-center gap-[12px]">
        <Button className="h-[48px] border border-solid border-[#F3F3F3] w-[150px] md:w-[180px] bg-[#FFF]  text-[#0E0E0E] f600" radius="none">
          <div className="pt-[2px]">运行机制</div>
        </Button>
        <Button 
          className="h-12 opacity-100 bg-[#101010] text-[#fff]  w-[150px] md:w-[180px]" 
          radius="none"
          onPress={() => router.push('/create')}
        >
          <div className="pt-[2px]">创建代币</div>
        </Button>
      </div>
    </div>
  );
};

export default Home;
