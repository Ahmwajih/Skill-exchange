"use client";

import { SessionProvider } from "next-auth/react";
import StoreProvider from '@/app/StoreProvider'; 


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <StoreProvider>
        <SessionProvider>{children}</SessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}