import type { FC, ReactNode } from "react";
import Header from "./Header";

let Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="text-black">{children}</main>
    </>
  );
};

export default Layout;
