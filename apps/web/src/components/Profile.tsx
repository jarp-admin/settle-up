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
        <Link href="/profile">
          <img
            className="rounded-full object-cover object-center"
            alt="Profile Picture"
            width={60}
            height={60}
            src={user.image || "/default.jpg"}
          />
        </Link>
      ) : (
        <SignIn />
      )}
    </>
  );
};

export default Profile;
