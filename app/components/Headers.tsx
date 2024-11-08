"use client";
import React from "react";
import Logo from "../public/Logo.svg";
import Image from "next/image";
import headerimage from "../public/headerimage.jpg";
import Link from "next/link";

export default function Headers() {
  return (
    <div className="m-0">
      <header className="bg-light-blue dark:bg-gray-800 text-brown dark:text-white">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:p-0 md:p-0">
          <Link href="/home">
            <Image
              className="logo hidden md:block"
              src={Logo}
              alt="logo"
              width={120}
              height={100}
            />
          </Link>
          <div className="flex justify-center items-center col-span-1 md:col-span-4">
            <h1 className="text-center font-roboto font-medium text-xl md:text-2xl lg:text-5xl">
              Empowering Connections through Skill Exchange
            </h1>
          </div>
        </div>
      </header>

      <div className="w-full ">
        <Image
          src={headerimage}
          alt="header image"
          layout="responsive"
          width={1375}
          height={226}
          className="w-full h-auto"
        />
      </div>
      <section className="flex flex-col self-stretch w-full bg-white max-md:max-w-full">
        <div className="flex overflow-hidden relative flex-col justify-center items-center px-16 py-24 w-full min-h-[796px] max-md:px-5 max-md:max-w-full">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/5fd32c8ffeb0b15d2f4ebca8c74ebbd3d507d81eb53433933fcedfaa997276b4?placeholderIfAbsent=true&apiKey=b728ceb3dbd545adac55a3a07f0354a7"
            alt="Background pattern"
            className="object-cover absolute inset-0 size-full"
          />
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
                    "Our series of resources and guides is here to support you
                    in expanding your skills. New to the community? Start with
                    our Foundational Skills section to build core knowledge.
                    Already have experience? Connect with other skilled members
                    to exchange knowledge in high-demand areas. Visit our FAQ
                    page to learn how to join the conversation and start trading
                    skills today."
                  </p>
                  <button className="overflow-hidden gap-2 self-stretch px-5 py-3 mt-3.5 text-base text-green-50 bg-orange-400 rounded-md min-h-[46px] shadow-[0px_1px_2px_rgba(105,81,255,0.05)]">
                    Get Started
                  </button>
                </div>
              </div>
              <div className="flex flex-col ml-5 w-3/5 max-md:ml-0 max-md:w-full">
                <div className="flex relative flex-col grow max-md:mt-10 max-md:max-w-full">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/e249fb477c5c0cb23f7fe15f97cb847ea3b586a835041d73bdc1d59d84b74d03?placeholderIfAbsent=true&apiKey=b728ceb3dbd545adac55a3a07f0354a7"
                    alt="Decorative element"
                    className="object-contain max-w-full aspect-square w-[129px]"
                  />
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/ac09f2fb5ad59e6341f74b127d5d3924fb94360f70e9c34362f8044b403234d3?placeholderIfAbsent=true&apiKey=b728ceb3dbd545adac55a3a07f0354a7"
                    alt="Decorative element"
                    className="object-contain self-end mt-96 max-w-full aspect-[1.64] w-[149px] max-md:mt-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
