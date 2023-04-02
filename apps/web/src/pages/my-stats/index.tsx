import { NextPage } from "next";
import { useSession } from "next-auth/react";

const MyStats: NextPage = () => {
  let { data: session } = useSession();
  let user = session?.user;

  return (
    <>
      {user && 
<div className="dropdown dropdown-end">
hello stats page
</div>
}
    </>
  );
};

export default MyStats;