import React, { useEffect, useMemo, useState } from "react";
import { Form, Input, Button, Textarea, useDisclosure, Image } from "@heroui/react";
import { useRouter } from "next/navigation";
import MyAvatar from "@/components/common/AvatarImage";
import ResponsiveDialog from "../common/ResponsiveDialog";
import pinFileToIPFS from "@/utils/pinata";
import { toast } from "sonner";
import { ethers } from "ethers";
// import FactoryABIData from "@/constant/OkayFunFactory.abi.json";
import FactoryABIData from "@/constant/OkayFunFactory3.abi.json";
const FactoryABI = FactoryABIData.abi;
import { CONTRACT_CONFIG, DEFAULT_CHAIN_ID } from "@/config/chains";
import { randomBytes } from "crypto";

type Beneficiary = {
    id: string;
    label: string;
    percent: number;
};

const MAX_AVATAR_MB = 5;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

/** 与 HeroUI Input 保持一致的错误样式 */
function FieldError({ message }: { message?: string | null }) {
    if (!message) return null;
    return <p className="text-[12px] text-danger mt-1 leading-[1.1]">{message}</p>;
}

/** 头像字段：用“代理校验输入”确保优先校验头像 */
function AvatarField({
    valueUrl,
    onPick,
    onClear,
    required,
    name = "avatar",
    maxMB = MAX_AVATAR_MB,
    loading = false,
}: {
    valueUrl: string | null;
    onPick: (file?: File) => void;
    onClear: () => void;
    required?: boolean;
    name?: string;
    maxMB?: number;
    loading?: boolean;
}) {
    const inputId = "avatar-upload-input";
    const labelId = "avatar-upload-label";
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const [errorText, setErrorText] = React.useState<string | null>(null);

    const setError = (msg: string | null) => {
        setErrorText(msg);
        if (msg) wrapperRef.current?.classList.add("border-[#f31260]");
        else wrapperRef.current?.classList.remove("border-[#f31260]");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!ACCEPTED_TYPES.includes(file.type)) {
                e.target.value = "";
                onPick(undefined);
                return;
            }
            const sizeMB = file.size / (1024 * 1024);
            if (sizeMB > maxMB) {
                e.target.value = "";
                onPick(undefined);
                return;
            }
        }
        setError(null);
        onPick(file);
    };

    return (
        <div className="w-full">
            {/* 代理校验输入：保持在最上方，DOM 参与 required 校验（不要 display:none） */}
            <input
                // 这个输入不提交业务数据，仅用于 required 校验顺序
                tabIndex={-1}
                aria-hidden="true"
                className="sr-only absolute h-0 w-0 p-0 m-0"
                required={!!required}
                // 有头像则通过，无头像则为空触发 invalid
                value={valueUrl ? "1" : ""}
                onChange={() => { }}
                // 提示与样式同步
                onInvalid={(e) => {
                    e.preventDefault();
                }}
            />

            <div className="flex items-center justify-between pb-[8px]">
                <label
                    id={labelId}
                    htmlFor={inputId}
                    className={["text-[14px] text-[#666] font-bold", errorText && "text-[#f31260]"].join(" ")}
                >
                    图标
                    {required ? <span className="text-[#f31260] ml-[2px]">*</span> : null}
                </label>
            </div>

            <div className="flex items-center" aria-labelledby={labelId}>
                <div
                    ref={wrapperRef}
                    className={[
                        "relative w-[84px] h-[84px] shrink-0 overflow-hidden",
                    ].join(" ")}
                >
                    <Image
                        src={valueUrl || "/default.png"}
                        alt="avatar"
                        className="w-[80px] h-[80px] border-1 border-[#F3F3F3] rounded-[0px] object-cover"
                    />
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full">
                            <div className="w-[84px] h-[84px] border-t-transparent animate-spin"></div>
                        </div>
                    )}
                    {/* 真正的文件选择输入：不再 required，让代理来控制校验顺序 */}
                    <input
                        id={inputId}
                        name={name}
                        type="file"
                        accept={ACCEPTED_TYPES.join(",")}
                        className="opacity-0 w-full h-full absolute top-0 left-0 z-10 cursor-pointer"
                        aria-label='uploadAvatar'
                        onChange={handleChange}
                        onInput={() => setError(null)}
                        disabled={loading}
                    />
                </div>
            </div>

            <FieldError message={errorText} />
        </div>
    );
}

export default function CreateForm() {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [ticker, setTicker] = useState("");
    const [nameVal, setNameVal] = useState("");

    // 头像
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarError, setAvatarError] = useState<string | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [ipfsHash, setIpfsHash] = useState<string | null>(null);
    const [createLoading, setCreateLoading] = useState(false);
    const [descriptionVal, setDescriptionVal] = useState("");
    const [websiteVal, setWebsiteVal] = useState("");
    const [xVal, setXVal] = useState("");
    const [telegramVal, setTelegramVal] = useState("");
    const [peopleVal, setPeopleVal] = useState("");
    const [createdTokenAddress, setCreatedTokenAddress] = useState<string | null>(null);
    const factoryAddr = CONTRACT_CONFIG.FACTORY_CONTRACTV3;











    // 切换网络
    const switchNetwork = async () => {

    };


    useEffect(() => {
        if (!avatarFile) {
            setAvatarUrl(null);
            return;
        }
        const url = URL.createObjectURL(avatarFile);
        setAvatarUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [avatarFile]);

    const onPickAvatar = async (file?: File) => {
        setAvatarError(null);
        if (!file) return;

        if (!ACCEPTED_TYPES.includes(file.type)) {
            return;
        }
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > MAX_AVATAR_MB) {
            return;
        }

        // 上传到 IPFS
        try {
            setUploadLoading(true);
            const res = await pinFileToIPFS(file);
            if (res) {
                setIpfsHash(res);
                setAvatarFile(file);
            }
        } catch (error) {
            console.error("IPFS upload error:", error);
        } finally {
            setUploadLoading(false);
        }
    };

    const onClearAvatar = () => {
        setAvatarFile(null);
        setAvatarUrl(null);
        setAvatarError(null);
        setIpfsHash(null);
    };

    // 满足必填：头像、Name、Ticker、税费指定受益人 均存在
    const requiredValid = !!avatarUrl && nameVal.trim().length > 0 && ticker.trim().length > 0 && peopleVal.trim().length > 0;
    const readyToSubmit = requiredValid;



    // 上传最终的 JSON 元数据到 IPFS
    const uploadFile = async () => {
        try {
            const params = {
                name: nameVal,
                symbol: ticker,
                image: ipfsHash,
                description: descriptionVal,
                website: websiteVal,
                x: xVal,
                telegram: telegramVal,
                people: peopleVal,
            };
            const res = await pinFileToIPFS(params, "json");
            if (!res) {
                setCreateLoading(false);
                return false;
            }
            return res;
        } catch (error) {
            setCreateLoading(false);
            return false;
        }
    };

    // 创建代币合约调用
    const createToken = async (metadataHash: string) => {
        try {
            // if (!signer || !provider) {
            //     throw new Error("Wallet not ready");
            // }
            const signer = '' as any;
            const provider = '' as any;

            const salt = randomBytes(32).toString("hex");
            const factoryContract = new ethers.Contract(factoryAddr, FactoryABI, signer);

            // 估算 gas
            let gasLimit;
            try {
                const estimatedGas = await factoryContract.createToken.estimateGas(nameVal, ticker, metadataHash, salt);
                gasLimit = estimatedGas + (estimatedGas * BigInt(20)) / BigInt(100); // +20% buffer
            } catch (e) {
                gasLimit = undefined;
            }

            // 调用创建代币合约
            let tx;
            try {
                tx = await factoryContract.createToken(nameVal, ticker, metadataHash, salt, {
                    ...(gasLimit && { gasLimit }),
                });
            } catch (error: any) {
                // 检查用户拒绝交易
                if (
                    error?.code === 4001 ||
                    error?.message?.toLowerCase().includes("user rejected") ||
                    error?.cause?.message?.toLowerCase().includes("user rejected")
                ) {
                    toast.error('用户已拒绝');
                    return null;
                }
                throw error;
            }

            await tx.wait();

            // 计算新创建的代币地址 - 只需要 salt 参数
            const readOnlyContract = new ethers.Contract(factoryAddr, FactoryABI, provider);
            const tokenAddress = await readOnlyContract.calculateTokenAddress(salt);

            return tokenAddress;
        } catch (error) {
            toast.error('创建失败');
            throw error;
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        // 统一触发一次原生校验（遵循 DOM 顺序，先校验头像代理）
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // 检查钱包连接
        // if (!isConnected || !address) {
        //     toast.error('未连接钱包');
        //     return;
        // }

        // 检查是否有头像的 IPFS hash
        if (!ipfsHash) {
            toast.error('图标上传失败 请重试');
            return;
        }

        // 检查网络
        // if (provider) {
        //     const network = await provider.getNetwork();
        //     if (Number(network.chainId) !== DEFAULT_CHAIN_ID) {
        //         const switched = await switchNetwork();
        //         if (!switched) {
        //             toast.error(t("Toast.text6"));
        //             return;
        //         }
        //     }
        // }

        try {
            setCreateLoading(true);


            // 1. 上传最终的 JSON 元数据到 IPFS
            const metadataHash = await uploadFile();
            if (!metadataHash) {
                return; // uploadFile 内部已经处理了错误
            }

            // 2. 调用合约创建代币
            const tokenAddress = await createToken(metadataHash);
            if (!tokenAddress) {
                return; // createToken 内部已经处理了错误提示
            }

            setCreatedTokenAddress(tokenAddress as string);
            onOpen();
            toast.success('创建成功');
        } catch (error: any) {
            console.error("Create error:", error);

            // 检查用户拒绝交易
            const errorMessage = error?.message || "";
            const causeMessage = error?.cause?.message || "";
            const errorString = JSON.stringify(error).toLowerCase();

            if (
                error?.code === 4001 ||
                errorMessage.toLowerCase().includes("user rejected") ||
                causeMessage.toLowerCase().includes("user rejected") ||
                errorString.includes("user rejected")
            ) {
                toast.error('用户拒绝了交易');
            } else if (errorMessage.includes("insufficient funds") || errorString.includes("insufficient funds")) {
                toast.error('余额不足');
            } else if (errorMessage.includes("gas") || errorMessage.includes("Gas")) {
                toast.error('Gas 费用不足');
            } else {
                toast.error('创建失败');
            }
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <>
            <Form className="w-full gap-[24px]" onSubmit={onSubmit}>
                {/* 头像（必填，统一提示样式） */}
                <AvatarField
                    valueUrl={avatarUrl}
                    onPick={onPickAvatar}
                    onClear={onClearAvatar}
                    required
                    loading={uploadLoading}
                />

                {/* 基本信息 */}
                <Input
                    classNames={{
                        inputWrapper: "h-[48px] border-[#F3F3F3]  border-1",
                        input: "f600 text-[14px] text-[#101010] placeholder:text-[#999] caret-[#9AED2C]",
                    }}
                    isRequired
                    errorMessage='请输入名称'
                    label={<span className="text-[14px] text-[#666]">名称</span>}
                    labelPlacement="outside-top"
                    name="name"
                    placeholder='请输入名称'
                    variant="bordered"
                    value={nameVal}
                    onChange={(e) => setNameVal(e.target.value)}
                    maxLength={20}
                    radius="none"
                />

                {/* Ticker：强制大写 + 字距 */}
                <Input
                    classNames={{
                        inputWrapper: "h-[48px] border-[#F3F3F3]  border-1",
                        input: "f600 text-[14px] text-[#101010] placeholder:text-[#999] uppercase tracking-[-0.07px] caret-[#9AED2C]",
                    }}
                    isRequired
                    errorMessage='请输入Ticker'
                    label={<span className="text-[14px] text-[#666]">Ticker</span>}
                    labelPlacement="outside-top"
                    name="ticker"
                    placeholder="请输入Ticker"
                    variant="bordered"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    aria-label='ticker'
                    maxLength={20}
                    radius="none"
                />

                <Textarea
                    classNames={{
                        inputWrapper: "border-[#F3F3F3]  border-1",
                        input: "f600 text-[14px] text-[#101010] placeholder:text-[#999] caret-[#9AED2C]",
                        label: "pb-[8px]",
                    }}
                    label={
                        <div className="flex items-center gap-2">
                            <span className="text-[14px] text-[#666]">描述</span>
                            <span className="text-[#999]">-可选</span>
                        </div>
                    }
                    labelPlacement="outside"
                    placeholder="请输入描述"
                    variant="bordered"
                    name="description"
                    aria-label="请输入描述"
                    value={descriptionVal}
                    onChange={(e) => setDescriptionVal(e.target.value)}
                    maxLength={200}
                    radius="none"
                />
                {/* 社交链接 */}
                <Input
                    classNames={{
                        inputWrapper: "h-[48px] border-[#F3F3F3]  border-1",
                        input: "f600 text-[14px] text-[#101010] placeholder:text-[#999] caret-[#9AED2C]",
                    }}
                    label={
                        <div className="flex items-center gap-2">
                            <span className="text-[14px] text-[#666]">网站</span>
                            <span className="text-[#999]">-可选</span>
                        </div>
                    }
                    labelPlacement="outside-top"
                    name="website"
                    placeholder="请输入网站"
                    variant="bordered"
                    type="url"
                    aria-label="请输入网站"
                    value={websiteVal}
                    onChange={(e) => setWebsiteVal(e.target.value)}
                    radius="none"
                />
                <Input
                    classNames={{
                        inputWrapper: "h-[48px] border-[#F3F3F3]  border-1",
                        input: "f600 text-[14px] text-[#101010] placeholder:text-[#999] caret-[#9AED2C]",
                    }}
                    label={
                        <div className="flex items-center gap-2">
                            <span className="text-[14px] text-[#666]">X</span>
                            <span className="text-[#999]">-可选</span>
                        </div>
                    }
                    labelPlacement="outside-top"
                    name="x"
                    placeholder="X"
                    variant="bordered"
                    type="url"
                    aria-label="X"
                    value={xVal}
                    onChange={(e) => setXVal(e.target.value)}
                    radius="none"
                />
                <Input
                    classNames={{
                        inputWrapper: "h-[48px] border-[#F3F3F3]  border-1",
                        input: "f600 text-[14px] text-[#101010] placeholder:text-[#999] caret-[#9AED2C]",
                    }}
                    label={
                        <div className="flex items-center gap-2">
                            <span className="text-[14px] text-[#666]">Telegram</span>
                            <span className="text-[#999]">-可选</span>
                        </div>
                    }
                    labelPlacement="outside-top"
                    name="telegram"
                    placeholder='Telegram'
                    variant="bordered"
                    type="url"
                    aria-label='Telegram'
                    value={telegramVal}
                    onChange={(e) => setTelegramVal(e.target.value)}
                    radius="none"
                />

                <Button
                    className={[
                        "w-full h-[44px] text-[14px] mb-[50px] f600 full",
                        readyToSubmit ? "bg-[#101010] text-[#FFF]" : "bg-[#999] text-[#FFF]",
                    ].join(" ")}
                    type="submit"
                    aria-label='btn'
                    isLoading={createLoading}
                    disabled={createLoading || !readyToSubmit}
                    radius="none"
                >
                    立即创建
                </Button>
                {/* <div className="" onClick={() => { onOpen() }}>1</div> */}
            </Form>
            <ResponsiveDialog
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title=''
                maxVH={70}
                size="md"
                classNames={{ body: "text-[#fff]" }}
            >
                <div className="flex flex-col items-center pt-[20px]">
                    <MyAvatar
                        src={avatarUrl || "/images/common/default.png"}
                        alt='tokenAvatar'
                        className="w-[80px] h-[80px] rounded-full"
                    />
                    <div className="text-[17px] f600 mt-[12px]">{ticker}</div>
                    <div className="text-[13px] text-[#67646B] mt-[4px]">{nameVal}</div>
                    <Button
                        fullWidth
                        className="f500 text-[14px] text-[#fff] bg-[#1E1E1E] h-[48px] mt-[32px] rounded-full"
                        onPress={() => {
                            if (createdTokenAddress) {
                                router.push(`/meme/${createdTokenAddress}`);
                            }
                        }}
                    >
                        查看详情
                    </Button>
                    <Button
                        fullWidth
                        className="f500 text-[14px] bg-[#FFF] text-[#0E0E0E] h-[48px] my-[12px] rounded-full"
                        onPress={() => {
                            const text =
                                `Just found $${ticker.toUpperCase()} 🚀\n100% Fair Launch on @okaydotfun 👌\nCome and join 👉 https://okay.fun/details/${createdTokenAddress}`
                            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                            window.open(url, "_blank");
                        }}
                    >
                        分享到 X
                    </Button>
                </div>
            </ResponsiveDialog>
        </>
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

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" viewBox="0 0 32 24" fill="none">
        <rect width="32" height="24" rx="12" fill="#383838" />
        <path d="M13.7324 6.5L21.0654 17.5H18.2676L10.9346 6.5H13.7324Z" stroke="white" />
        <path d="M15.623 13.9229L12 18H10L14.8398 12.5537L15.623 13.9229ZM22.667 6L17.4014 11.9229L16.6318 10.5381L20.667 6H22.667Z" fill="white" />
    </svg>
)

const FailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="8" fill="#CA3F64" />
        <path d="M5.00977 5.01123L10.994 10.9955" stroke="black" stroke-width="1.5" />
        <path d="M5.01562 10.9956L10.9998 5.01138" stroke="black" stroke-width="1.5" />
    </svg>
)

const Success = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="8" fill="#9AED2C" />
        <path d="M4.63965 8.40016L6.87965 10.6402L11.3596 6.16016" stroke="black" stroke-width="1.5" stroke-linecap="square" />
    </svg>
)

const InfoIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" {...props}>
        <path d="M6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0ZM5.25 5.25V9.25H6.75V5.25H5.25ZM5.25 2.75V4.25H6.75V2.75H5.25Z" fill="white" fill-opacity="0.15" />
    </svg>
)