import React from 'react';

interface IAuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({children}: Readonly<IAuthLayoutProps>) {
  return <main className="">{children}</main>;
}
