import { NextPage } from "next";
import { useSession } from "next-auth/react";

const Leaderboard: NextPage = () => {
  let { data: session } = useSession();
  let user = session?.user;
let leaderboardData = new Map<string, number>()
let testData = [["user1", 10], ["user4", 30], ["user3", 12], ["user2", 44]]  
return (
    <>
      {testData.map((userID, userDebt)=>{
        <div className="grid grid-cols-2">
            <h3 className="col-span-2">userID</h3>
        <h3 className="col-span-2">{userDebt}</h3></div>
      })}
    </>
  );
};

export default Leaderboard;