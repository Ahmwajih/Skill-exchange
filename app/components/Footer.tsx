'use client';
import React, { useState } from 'react';

interface FooterProps {
  companyName: string;
  year: number;
}

const Footer: React.FC<FooterProps> = ({ companyName, year }) => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com' },
    { name: 'Github', url: 'https://github.com' },
    { name: 'Instagram', url: 'https://instagram.com' },
    { name: 'Linkedin', url: 'https://linkedin.com' },
  ];

  return (
<footer className="flex flex-col bg-blue">
  <div className="flex flex-col items-center px-8 pt-10 pb-8 bg-blue-400 max-md:px-4 max-md:py-6">
    <div className="w-full max-w-[1366px]">
      <div className="flex gap-8 max-md:flex-col">
        <div className="flex flex-col w-[70%] max-md:w-full">
          <div className="flex flex-wrap gap-6 justify-between items-start text-white max-md:mt-5">
            <div className="flex flex-col font-bold">
              <h2 className="self-start text-2xl font-dancing">Community Skill Trade {companyName}</h2>
              <p className="mt-4 text-xs max-md:text-sm">
                The experience with Skill Trade has been outstanding. Every interaction within our community has been met with prompt support and meaningful connections.
              </p>
            </div>
            <nav className="flex flex-col items-start mt-2.5 text-xs font-bold">
              <h3 className="ml-4 text-base max-md:ml-2.5">Quick links</h3>
              <ul>
                {quickLinks.map((link) => (
                  <li key={link.name} className="gap-2.5 self-stretch px-2.5 py-3 mt-4 min-h-[35px]">
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col mt-2.5">
              <nav className="flex flex-col items-start self-start ml-3 text-xs font-bold max-md:ml-2.5">
                <h3 className="self-stretch text-base">Social media</h3>
                <ul className="mt-5">
                  {socialLinks.map((link, index) => (
                    <li key={link.name} className={index > 0 ? 'mt-3' : ''}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <p className="mt-20 text-base font-semibold max-md:mt-8">{companyName} Community Skill Trade  2024 © {year}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[30%] max-md:w-full">
          <div className="flex flex-col items-start mt-2.5 w-full max-md:mt-5">
            <h3 className="text-base font-bold text-white">Newsletter</h3>
            <p className="mt-4 text-xs font-bold text-white">
              Subscribe to our newsletter to stay updated on the latest skill exchange opportunities, community events, and exclusive member perks.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-4 justify-between self-stretch py-1.5 pr-1.5 pl-5 mt-5 bg-white rounded-md">
              <label htmlFor="email" className="sr-only">Enter your email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className="my-auto text-xs font-medium text-black text-opacity-50 bg-transparent border-none outline-none"
                aria-label="Enter your email"
                required
              />
              <button type="submit" className="px-6 pt-3 pb-5 text-sm font-semibold text-white whitespace-nowrap bg-blue-400 rounded max-md:px-4">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</footer>

  );
};

export default Footer;