import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

const Profile: FC = () => {
  let { data: session } = useSession();
  let user = session?.user;

  return (
    <>
      {user ? (
        <Link href="/profile">
          <Image
            alt="Profile Picture"
            width={100}
            height={100}
            src={user.image || "/default.jpg"}
          />
        </Link>
      ) : (
        <button onClick={() => signIn()}>log in</button>
      )}
    </>
  );
};

export default Profile;
