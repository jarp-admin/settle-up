import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import SignIn from "./SignIn";

const Profile: FC = () => {
  let { data: session } = useSession();
  let user = session?.user;

  return (
    <>
      {user ? (

<div className="dropdown dropdown-end">
  <label tabIndex={0} className="btn btn-link">     
    <img
      className="rounded-full object-cover object-center"
      alt="Profile Picture"
      width={60}
      height={60}
      src={user.image || "/default.jpg"}
      />
  </label>
  <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-slate-800 rounded-box w-52">
    <li><Link href="/profile">Profile</Link></li>
    <li><Link href="/my-stats">My Stats</Link></li>
  </ul>
</div>


      ) : (
        <SignIn />
      )}
    </>
  );
};

export default Profile;
