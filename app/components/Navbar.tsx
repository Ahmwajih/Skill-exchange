'use client';
import React, { useState } from "react";
import Logo from "@/app/public/Logo.svg";
import Image from "next/image";
import { FaSearch } from "react-icons/fa"; 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/features/auth/authSlice";
import 'react-toastify/dist/ReactToastify.css';


interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

  const navItems = [
    { label: "Home", isActive: true, href: "/" },
    { label: "Dashboard", isActive: true, href: "/user_dashboard" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  return (
    <header className="w-full bg-neutral-50 px-6 py-4 border-b shadow-md max-md:px-4">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        <div className="hidden md:block">
          <Image
            loading="lazy"
            src={Logo}
            alt="Logo"
            className="object-contain w-36"
          />
        </div>

        <div className="hidden md:block flex-1 mx-4">
          <SearchBar />
        </div>

        <nav className="flex flex-wrap gap-10 self-stretch my-auto text-black whitespace-nowrap max-md:max-w-full">
          {navItems.map((item, index) => (
            <NavItem key={index} label={item.label} isActive={item.isActive} href={item.href} />
          ))}
        </nav>

        <div className="flex mx-1 items-center gap-4">
          <Avatar />
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-orange rounded-md hover:bg-orange transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="block md:hidden">
          <FaSearch
            onClick={toggleSearch}
            className="text-gray-600 w-6 h-6 cursor-pointer"
          />
        </div>
      </div>

      {isSearchOpen && (
        <div className="block md:hidden mt-4">
          <SearchBar />
        </div>
      )}
    </header>
  );
};


interface NavItemProps {
    label: string;
    isActive: boolean;
    href: string;
  }
  
  const NavItem: React.FC<NavItemProps> = ({ label, isActive, href }) => {
    return (

        <Link href= {href} className={`${isActive ? 'font-bold text-stone-500' : ''}`}>
          {label}
        </Link>
    );
  };

const SearchBar: React.FC = () => {
  return (
    <input
      type="text"
      placeholder="Search for Skills"
      className="w-full px-4 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring focus:ring-blue-300"
    />
  );
};

const Avatar: React.FC = () => {
  return (
    <img
      src="https://via.placeholder.com/40"
      alt="User Avatar"
      className="w-10 h-10 rounded-full"
    />
  );
};

export default Navbar;

