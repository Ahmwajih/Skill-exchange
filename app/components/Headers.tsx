import React from "react";
import Logo from "../public/Logo.svg";
import Image from "next/image";
import headerimage from "../public/headerimage.jpg";

export default function Headers() {
  return (
    <div className="m-0">
      <header className="bg-light-blue dark:bg-gray-800 text-brown dark:text-white">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:p-4 lg:p-0 md:p-0">
          <div className="flex justify-center md:justify-start items-center col-span-1 md:col-span-1">
            <Image className="logo" src={Logo} alt="logo" width={120} height={100} />
          </div>
          <div className="flex justify-center items-center col-span-1 md:col-span-4 ">
            <h1 className="text-center font-roboto font-medium text-xl md:text-2xl lg:text-5xl">
              Empowering Connections through Skill Exchange
            </h1>
          </div>
        </div>
      </header>
      <div  className="w-full ">
        <Image src={headerimage} alt="header image" layout="responsive" width={1375} height={226} className="w-full h-auto" />
      </div>
      <section className="flex flex-col self-stretch w-full bg-white max-md:max-w-full">
      <div className="flex overflow-hidden relative flex-col justify-center items-center px-16 py-24 w-full min-h-[796px] max-md:px-5 max-md:max-w-full">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/5fd32c8ffeb0b15d2f4ebca8c74ebbd3d507d81eb53433933fcedfaa997276b4?placeholderIfAbsent=true&apiKey=b728ceb3dbd545adac55a3a07f0354a7" alt="Background pattern" className="object-cover absolute inset-0 size-full" />
        <div className="relative w-full max-w-[1290px] max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="flex flex-col w-2/5 max-md:ml-0 max-md:w-full">
              <div className="flex relative flex-col items-start self-stretch my-auto w-full font-medium max-md:mt-10 max-md:max-w-full">
                <div className="overflow-hidden gap-0.5 self-stretch px-2 py-0.5 text-xs text-white whitespace-nowrap bg-orange-400 min-h-[22px] rounded-[36px] shadow-[0px_1px_2px_rgba(105,81,255,0.05)]">
                  FEATURES
                </div>
                <h2 className="mt-4 text-5xl font-bold tracking-tighter leading-none text-slate-800 max-md:text-4xl">
                  Learn New Skills
                </h2>
                <p className="self-stretch mt-3.5 text-xl leading-8 text-center text-slate-500 max-md:max-w-full">
                  "Our series of resources and guides is here to support you in expanding your skills. New to the community? Start with our Foundational Skills section to build core knowledge. Already have experience? Connect with other skilled members to exchange knowledge in high-demand areas. Visit our FAQ page to learn how to join the conversation and start trading skills today."
                </p>
                <button className="overflow-hidden gap-2 self-stretch px-5 py-3 mt-3.5 text-base text-green-50 bg-orange-400 rounded-md min-h-[46px] shadow-[0px_1px_2px_rgba(105,81,255,0.05)]">
                  Get Started
                </button>
              </div>
            </div>
            <div className="flex flex-col ml-5 w-3/5 max-md:ml-0 max-md:w-full">
              <div className="flex relative flex-col grow max-md:mt-10 max-md:max-w-full">
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/e249fb477c5c0cb23f7fe15f97cb847ea3b586a835041d73bdc1d59d84b74d03?placeholderIfAbsent=true&apiKey=b728ceb3dbd545adac55a3a07f0354a7" alt="Decorative element" className="object-contain max-w-full aspect-square w-[129px]" />
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/ac09f2fb5ad59e6341f74b127d5d3924fb94360f70e9c34362f8044b403234d3?placeholderIfAbsent=true&apiKey=b728ceb3dbd545adac55a3a07f0354a7" alt="Decorative element" className="object-contain self-end mt-96 max-w-full aspect-[1.64] w-[149px] max-md:mt-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="flex flex-col items-center">
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d53f44d0b4930bc2c267dce9c30b2f4116e32dc1b203ed76d08054d5180281f8?placeholderIfAbsent=true&apiKey=b728ceb3dbd545adac55a3a07f0354a7" alt="" className="object-contain mt-6 ml-7 aspect-square w-[63px]" />
      <h2 className="mt-6 ml-7 text-3xl font-bold leading-none text-center text-slate-800">
        Join our community
      </h2>
      <form className="flex flex-col mt-12 ml-8 max-w-full w-[358px] max-md:mt-10">
        <div className="flex flex-col w-full max-w-[358px]">
          <label htmlFor="name" className="font-medium text-slate-700">Name*</label>
          <input
            type="text"
            id="name"
            className="flex overflow-hidden gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full bg-white rounded-lg border border-gray-300 border-solid shadow-sm min-h-[46px] text-slate-800"
            placeholder="Ahmed"
          />
        </div>
        <div className="flex flex-col mt-6 w-full max-w-[358px]">
          <label htmlFor="email" className="font-medium text-slate-700">Email*</label>
          <input
            type="email"
            id="email"
            className="flex overflow-hidden gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full bg-white rounded-lg border border-gray-300 border-solid shadow-sm min-h-[46px] text-slate-800"
            placeholder="Ahmed.Abidsa@skillTrade.com"
          />
        </div>
        <div className="flex flex-col mt-6 w-full max-w-[358px]">
          <label htmlFor="password" className="font-medium text-slate-700">Password*</label>
          <input
            type="password"
            id="password"
            className="flex overflow-hidden gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full bg-white rounded-lg border border-gray-300 border-solid shadow-sm min-h-[46px] text-slate-800"
          />
        </div>
        <div className="flex gap-5 justify-between mt-4 max-w-full text-xs font-medium w-[358px]">
          <div className="flex gap-2 text-slate-700">
            <input type="checkbox" id="remember" className="shrink-0 w-4 h-4 bg-white rounded border border-gray-300 border-solid shadow-sm" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <a href="#" className="text-right text-blue-400">Forgot your password?</a>
        </div>
        <button type="submit" className="overflow-hidden gap-2 self-stretch px-5 py-3 mt-6 max-w-full text-base font-medium text-green-50 bg-blue-400 rounded-md min-h-[46px] shadow-[0px_1px_2px_rgba(105,81,255,0.05)] w-[358px]">
          Sign Up
        </button>
        <button type="button" className="flex overflow-hidden gap-2 justify-center items-center px-5 py-3 mt-4 max-w-full text-base font-medium bg-white rounded-md border border-gray-100 border-solid shadow-sm min-h-[46px] text-slate-500 w-[358px]">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/58367ad1684e90ebb46e6dd71e7e80b32aae98a0e06ff83bd5b63b2393586283?placeholderIfAbsent=true&apiKey=b728ceb3dbd545adac55a3a07f0354a7" alt="Google logo" className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square" />
          <span>Sign in with Google</span>
        </button>
        <button type="button" className="flex overflow-hidden gap-2 justify-center items-center px-5 py-2.5 mt-4 max-w-full text-base font-medium bg-white rounded-md border border-gray-100 border-solid shadow-sm min-h-[46px] text-slate-500 w-[358px]">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/8173a5b673a4c6a8ab511addf3a1048b5d1d836e91ca4b2ae36cb42a81bc96c6?placeholderIfAbsent=true&apiKey=b728ceb3dbd545adac55a3a07f0354a7" alt="GitHub logo" className="object-contain shrink-0 self-stretch my-auto aspect-[1.04] w-[27px]" />
          <span>Sign in with Github</span>
        </button>
      </form>
      <p className="mt-4 ml-7 text-xs font-medium leading-5 text-center text-blue-400">
        Already have an account? <a href="#" className="text-blue-400">Sign In</a>
      </p>
    </section>
    
    </div>
  );
}