import React from "react";
import Logo from "../public/Logo.svg";
import Image from "next/image";

export default function Headers() {
  return (
    <div className="m-0">
      <header className="bg-light-blue text-brown">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:p-4 lg:p-0 md:p-0">
          <div className="flex justify-center md:justify-start items-center col-span-1 md:col-span-1">
            <Image className="logo" src={Logo} alt="logo" width={120} height={100} />
          </div>
          <div className="flex justify-center items-center col-span-1 md:col-span-4">
            <h1 className="text-center text-xl md:text-2xl lg:text-3xl">
              Empowering Connections through Skill Exchange
            </h1>
          </div>
        </div>
      </header>
    </div>
  );
}