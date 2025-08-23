import React, { useState } from "react";
import router from "next/router";
import CreateForm from "./Form";

const Create = () => {

	return (
		<div className="w-full max-w-[450px]">
			<div className="h-[48px] flex items-center justify-between relative">
				<BackIcon className="cursor-pointer relative z-1" onClick={() => router.push("/")} />
				<div className="w-full h-full flex items-center justify-center absolute top-0 left-0 text-[16px] text-[#fff] gap-[2px]">
					{/* {t('Form.title')} */}
				</div>
			</div>
			<CreateForm />
		</div>
	);
};

export default Create;

const BackIcon = (props: any) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
		<path d="M14.1768 5.81678C14.3721 6.01204 14.3721 6.32862 14.1768 6.52389L8.69676 12.004L14.1768 17.484C14.3721 17.6793 14.3721 17.9959 14.1768 18.1911L13.8233 18.5447C13.628 18.74 13.3114 18.74 13.1162 18.5447L6.9997 12.4282C6.76539 12.1939 6.76539 11.814 6.9997 11.5797L13.1162 5.46323C13.3114 5.26796 13.628 5.26796 13.8233 5.46323L14.1768 5.81678Z" fill="white" />
	</svg>
);
