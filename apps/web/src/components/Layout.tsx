import type { FC, ReactNode } from "react";
import Header from "./Header";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="pt-20 font-mono text-black">{children}</main>
    </>
  );
};

export default Layout;
