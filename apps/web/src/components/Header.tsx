import type { FC } from "react";
import Profile from "./Profile";
import Link from "next/link";

const Header: FC = () => {
  return (
    <div className="fixed flex h-20 w-full flex-row items-center px-10 justify-between bg-[#FFC517] p-2">
      <div className="flex flex-row gap-10 items-center">
      <h1 className="font-mono text-xl text-black font-bold">Settle-up!</h1>
      <Link className="btn " href='/leaderboard'>Leaderboard</Link>
      </div>
      <Profile />
    </div>
  );
};

export default Header;
