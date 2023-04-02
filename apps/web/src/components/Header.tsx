import type { FC } from "react";
import Profile from "./Profile";

const Header: FC = () => {
  return (
    <div className="fixed flex h-20 w-full flex-row items-center justify-between bg-[#FFC517] p-2">
      <h1 className="font-mono text-xl text-black">Settle-up!</h1>
      <Profile />
    </div>
  );
};

export default Header;
