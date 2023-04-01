import type { FC } from "react";
import Profile from "./Profile";

const Header: FC = () => {
  return (
    <div>
      <h1>Settle-up!</h1>
      <Profile />
    </div>
  );
};

export default Header;
