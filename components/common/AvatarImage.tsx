"use client";
const LoadingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    className="w-full h-full"
  >
    <circle cx="20" cy="20" r="19.5" fill="#1E1E1E" stroke="#1E1E1E" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.4798 11.8504C16.3149 11.657 17.165 11.5967 18.0009 11.6613C18.0093 11.6619 18.0177 11.6626 18.0261 11.6633C18.0796 11.6676 18.1331 11.6723 18.1865 11.6776C18.2278 11.6817 18.2691 11.6864 18.3102 11.691C18.3271 11.6929 18.3439 11.6947 18.3607 11.6967C19.5113 11.8334 20.5902 12.2035 21.5487 12.7586C21.5894 12.7821 21.6299 12.8062 21.6702 12.8304C21.6816 12.8372 21.6931 12.8438 21.7044 12.8507C22.6 13.3933 23.4029 14.1106 24.0576 14.9871C24.0655 14.9977 24.0733 15.0083 24.0811 15.0188C24.1086 15.056 24.1361 15.0932 24.1631 15.1309C24.1899 15.1684 24.2162 15.2063 24.2425 15.2443C24.2514 15.2572 24.2606 15.2701 24.2695 15.2831C24.3071 15.338 24.3441 15.3933 24.3803 15.4492L26.5812 11.6375H31.8485L27.0199 20.0003L31.8485 28.363H26.5812L24.3808 24.5521C23.8593 25.3575 23.1927 26.0814 22.3929 26.6819C22.3679 26.7008 22.3426 26.7193 22.3174 26.7379C22.2902 26.7578 22.263 26.7778 22.2355 26.7975C22.1916 26.829 22.1473 26.8599 22.1028 26.8905C22.0974 26.8943 22.0922 26.8982 22.0867 26.9019C21.3945 27.3766 20.6273 27.7496 19.8065 28C19.7984 28.0025 19.7903 28.0047 19.7822 28.0072C19.7299 28.023 19.6774 28.0384 19.6246 28.0532C19.5906 28.0627 19.5566 28.0718 19.5226 28.0809C19.4934 28.0887 19.4643 28.0967 19.435 28.1042C19.3881 28.1162 19.341 28.1274 19.2939 28.1386C19.2763 28.1427 19.2587 28.1471 19.241 28.1512C18.4083 28.3433 17.561 28.4031 16.7276 28.3388C16.7176 28.338 16.7076 28.3371 16.6977 28.3363C16.6448 28.332 16.592 28.3277 16.5393 28.3224C16.5063 28.3192 16.4734 28.3154 16.4405 28.3118C16.4116 28.3086 16.3826 28.3054 16.3537 28.3019C15.2076 28.1639 14.1329 27.7946 13.1778 27.2412C13.1432 27.2212 13.109 27.2006 13.0746 27.1801C13.0561 27.169 13.0374 27.1582 13.0189 27.1469C12.1267 26.6056 11.3266 25.8911 10.6736 25.0181C10.6626 25.0035 10.6516 24.9888 10.6407 24.9741C10.6153 24.9397 10.5899 24.9053 10.5649 24.8704C10.5364 24.8306 10.5084 24.7904 10.4805 24.7501C10.4732 24.7395 10.4658 24.7289 10.4585 24.7182C9.98659 24.0288 9.61512 23.2653 9.36541 22.4486C9.36146 22.4357 9.35766 22.4228 9.35378 22.41C9.33756 22.356 9.32166 22.3018 9.30651 22.2474C9.30219 22.2319 9.29837 22.2163 9.29414 22.2009C9.28151 22.1544 9.26886 22.108 9.25701 22.0613C9.24342 22.0079 9.23066 21.9544 9.21816 21.9009C9.21699 21.8959 9.21561 21.8909 9.21445 21.8858C9.02082 21.0503 8.96027 20.1999 9.02488 19.3635C9.02557 19.3544 9.02639 19.3452 9.02711 19.3361C9.03161 19.2802 9.03659 19.2245 9.0422 19.1688C9.04615 19.1288 9.05057 19.089 9.05507 19.0492C9.05678 19.0344 9.05823 19.0195 9.06002 19.0047C9.19641 17.855 9.56578 16.7769 10.12 15.8189C10.6709 14.8623 11.4173 14.0051 12.3413 13.313C12.364 13.2959 12.387 13.2793 12.4099 13.2625C12.435 13.2441 12.46 13.2255 12.4854 13.2073C12.5272 13.1772 12.5694 13.1478 12.6118 13.1184C12.6233 13.1105 12.6347 13.1023 12.6462 13.0944C13.3371 12.6216 14.1025 12.2497 14.9213 12.0001C14.9275 11.9982 14.9338 11.9965 14.9401 11.9946C14.995 11.978 15.05 11.9616 15.1054 11.9461C15.137 11.9373 15.1688 11.9291 15.2004 11.9206C15.231 11.9125 15.2615 11.904 15.2922 11.8961C15.346 11.8824 15.3999 11.8692 15.4538 11.8566C15.4625 11.8545 15.4711 11.8524 15.4798 11.8504ZM17.3636 16.199C17.0698 16.199 16.7837 16.2322 16.5091 16.2953C16.1507 16.3781 15.7984 16.5149 15.4632 16.7083C15.3268 16.7871 15.197 16.8731 15.0742 16.9655C14.6924 17.254 14.3667 17.6129 14.1165 18.0229C13.8192 18.5121 13.6366 19.062 13.5804 19.6286C13.5686 19.7509 13.5624 19.8749 13.5624 20.0003C13.5624 20.2931 13.5957 20.5781 13.6584 20.8519C13.7411 21.2113 13.8776 21.5648 14.0717 21.9009C14.1487 22.0343 14.2329 22.161 14.3229 22.2813C14.6124 22.6667 14.9736 22.9952 15.3865 23.2472C15.8992 23.5587 16.4785 23.7443 17.0738 23.7904C17.1695 23.7976 17.2661 23.8015 17.3636 23.8015C17.6577 23.8015 17.944 23.768 18.2189 23.7048C18.5771 23.6219 18.9295 23.4856 19.2645 23.2922C19.3977 23.2153 19.5242 23.1312 19.6444 23.0413C20.03 22.7516 20.3587 22.3905 20.6108 21.9774C20.6164 21.9682 20.6218 21.9589 20.6274 21.9497C20.637 21.9336 20.6464 21.9174 20.6558 21.9012L20.6556 21.9009L20.6907 21.84C20.9549 21.3611 21.113 20.8302 21.1545 20.2861C21.1615 20.1918 21.1649 20.0964 21.1649 20.0003C21.1649 19.6743 21.1238 19.3579 21.0466 19.0559C20.9632 18.7314 20.8354 18.4127 20.6605 18.1081L20.6556 18.0997C20.5928 17.991 20.5254 17.8864 20.4539 17.7864C20.138 17.3463 19.7306 16.9763 19.2593 16.7046C18.7915 16.4362 18.2718 16.2703 17.7373 16.2171C17.6144 16.2051 17.4897 16.199 17.3636 16.199Z"
      fill="#383838"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <rect width="40" height="40" fill="#1E1E1E" />
    <path
      d="M23.7705 11.002C25.1096 11.002 26.2256 11.3279 27.0801 11.9385L27.8105 11.209C28.0805 10.9393 28.5212 10.9391 28.791 11.209C29.0699 11.4789 29.0698 11.9107 28.791 12.1807L12.1807 28.791C12.0458 28.9258 11.8751 28.9979 11.6953 28.998C11.5154 28.998 11.344 28.9258 11.209 28.7998C10.9391 28.5299 10.9391 28.0893 11.209 27.8193L11.9424 27.084C11.7763 26.8511 11.6298 26.5978 11.5059 26.3252C11.1731 25.6055 11.002 24.751 11.002 23.7705V16.2295C11.0021 12.9546 12.9546 11.0021 16.2295 11.002H23.7705ZM28.7295 14.2959C28.9086 14.8744 28.998 15.521 28.998 16.2295V23.7705C28.9979 26.4314 27.7087 28.219 25.4688 28.7959C25.2963 28.8403 25.1182 28.8773 24.9346 28.9072C24.568 28.967 24.1796 28.998 23.7705 28.998H16.2295L15.9297 28.9922C15.2393 28.9666 14.6115 28.852 14.0527 28.6475L18.9023 23.7969C18.9462 23.8261 18.991 23.8537 19.0371 23.8789C19.2675 24.0048 19.5238 24.0794 19.7852 24.1045C19.8896 24.1145 19.9948 24.1172 20.0996 24.1113C20.5193 24.0878 20.9314 23.9366 21.251 23.6621L24.9941 20.4502C25.3012 20.1864 25.6907 20.0378 26.0908 20.0049C26.2051 19.9955 26.3203 19.9955 26.4346 20.0049C26.8345 20.0379 27.2243 20.1865 27.5312 20.4502L27.6484 20.5488V16.2295C27.6484 15.8428 27.6208 15.4832 27.5488 15.1504L28.6465 14.0527L28.7295 14.2959ZM16.2295 12.3516C13.6924 12.3517 12.3517 13.6924 12.3516 16.2295V23.7705C12.3516 24.4542 12.4691 25.0392 12.667 25.543L15.1494 23.876L26.1104 12.9092C25.5046 12.5391 24.721 12.3516 23.7705 12.3516H16.2295ZM17.3008 14.2598C18.4832 14.2599 19.4422 15.218 19.4424 16.4004C19.4424 17.583 18.4834 18.5419 17.3008 18.542C16.1181 18.542 15.1592 17.5831 15.1592 16.4004C15.1594 15.2179 16.1182 14.2598 17.3008 14.2598Z"
      fill="#383838"
    />
  </svg>
);

import React, {
  forwardRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { AvatarProps as BaseAvatarProps } from "@heroui/react";
import { AvatarIcon, useAvatar } from "@heroui/react";

export interface AvatarProps extends BaseAvatarProps {
  /**
   * 可选形状：
   * - circle: 完全圆形（默认）
   * - rounded: 圆角矩形
   * - square: 直角方形
   */
  shape?: "circle" | "rounded" | "square";
  /**
   * 自定义圆角（优先级高于 shape 映射），如 "12px" 或 12。
   */
  borderRadius?: string | number;
}

const MyAvatarInner = forwardRef<HTMLSpanElement, AvatarProps>((props, ref) => {
  const { shape, borderRadius, radius: radiusProp, ...rest } = props;
  // 将自定义 shape 映射为 HeroUI 的 radius 取值
  const mappedRadius: BaseAvatarProps["radius"] | undefined = (() => {
    if (radiusProp) return radiusProp;
    if (!shape) return undefined; // 使用库默认（通常是 full）
    const map: Record<string, BaseAvatarProps["radius"]> = {
      circle: "full",
      rounded: "md",
      square: "none",
    } as const;
    return map[shape];
  })();
  const {
    src,
    icon = <AvatarIcon />,
    alt,
    classNames,
    slots,
    name,
    showFallback,
    fallback: fallbackComponent,
    getInitials,
    getAvatarProps,
    getImageProps,
  } = useAvatar({
    ref,
    ...(mappedRadius ? { radius: mappedRadius } : {}),
    ...rest,
  });

  // 统一 SSR 与首次客户端渲染：若有 src，初始一律认为 loading，避免水合不匹配
  const [isLoading, setIsLoading] = useState<boolean>(!!src);
  const [isError, setIsError] = useState(false);

  // 处理图片加载、错误状态
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setIsError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setIsError(true);
  }, []);

  // 仅当 src 变化时重置内部状态，避免无关重渲染引发短暂 fallback
  useEffect(() => {
    let active = true;
    if (!src) {
      setIsLoading(false);
      setIsError(false);
      return;
    }
    const img = new Image();
    img.src = src;
    if (img.complete) {
      active && setIsLoading(false);
      active && setIsError(false);
    } else {
      active && setIsLoading(true);
      active && setIsError(false);
      img.onload = () => {
        active && setIsLoading(false);
      };
      img.onerror = () => {
        active && setIsError(true);
      };
    }
    return () => {
      active = false;
    };
  }, [src]);

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <span
      aria-label={alt || name || "avatar"}
      className={slots.fallback({ class: classNames?.fallback })}
      role="img"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        ...(borderRadius !== undefined
          ? {
              borderRadius:
                typeof borderRadius === "number"
                  ? `${borderRadius}px`
                  : borderRadius,
            }
          : {}),
      }}
    >
      {children}
    </span>
  );

  const fallback = useMemo(() => {
    const ariaLabel = alt || name || "avatar";

    if (isError)
      return (
        <Wrapper>
          <ErrorIcon />
        </Wrapper>
      );
    if (isLoading)
      return (
        <Wrapper>
          <LoadingIcon />
        </Wrapper>
      );

    if (!showFallback && src && !isError) return null;

    if (fallbackComponent) {
      return (
        <div
          aria-label={ariaLabel}
          className={slots.fallback({ class: classNames?.fallback })}
          role="img"
        >
          {fallbackComponent}
        </div>
      );
    }

    if (name) {
      return (
        <span
          aria-label={ariaLabel}
          className={slots.name({ class: classNames?.name })}
          role="img"
        >
          {getInitials(name)}
        </span>
      );
    }

    return (
      <span
        aria-label={ariaLabel}
        className={slots.icon({ class: classNames?.icon })}
        role="img"
      >
        {icon}
      </span>
    );
  }, [
    alt,
    name,
    icon,
    src,
    isError,
    isLoading,
    showFallback,
    fallbackComponent,
    classNames,
    slots,
    getInitials,
  ]);

  const imageProps = getImageProps();
  const containerProps = getAvatarProps();
  const mergedContainerStyle = {
    ...(containerProps as any).style,
    ...(borderRadius !== undefined
      ? {
          borderRadius:
            typeof borderRadius === "number"
              ? `${borderRadius}px`
              : borderRadius,
          overflow: "hidden" as const,
        }
      : { overflow: "hidden" as const }),
    willChange: "transform",
    contain: "paint layout style",
  } as React.CSSProperties;
  const mergedImgStyle = {
    ...(imageProps as any).style,
    ...(borderRadius !== undefined
      ? {
          borderRadius:
            typeof borderRadius === "number"
              ? `${borderRadius}px`
              : borderRadius,
        }
      : {}),
  } as React.CSSProperties;

  return (
    <div
      {...containerProps}
      style={mergedContainerStyle}
      suppressHydrationWarning
    >
      {src && !isError && (
        <img
          {...imageProps}
          alt={alt}
          style={mergedImgStyle}
          onLoad={(e) => {
            imageProps.onLoad?.(e);
            handleLoad();
          }}
          onError={(e) => {
            imageProps.onError?.(e);
            handleError();
          }}
        />
      )}
      {fallback}
    </div>
  );
});

MyAvatarInner.displayName = "MyAvatar";

// 避免无关状态变更导致头像重渲染
const areEqual = (prev: AvatarProps, next: AvatarProps) => {
  return (
    prev.src === next.src &&
    prev.alt === next.alt &&
    prev.shape === next.shape &&
    prev.borderRadius === next.borderRadius &&
    prev.className === next.className
  );
};

export default React.memo(MyAvatarInner, areEqual);
