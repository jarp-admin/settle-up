import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Graph from "~/components/Graph";
import useMostDebted from "~/hooks/useMostDebted";

const Home: NextPage = () => {
  let leaderboardData = useMostDebted();

  if (!leaderboardData) return <></>
  return (
    <div className="-mt-20 flex w-full h-screen justify-center items-center font-mono overflow-clip">
        {leaderboardData && 
        <div className="grid grid-cols-4 bg-slate-800 rounded-xl shadow-md min-w-60 max-w-max md:w-96">
          <h2 className="col-span-2 text-primary font-semibold text-center bg-slate-700 rounded-tl-xl p-4 text-xl">User</h2>
          <h2 className="col-span-2 text-primary font-semibold text-center bg-slate-700 rounded-tr-xl p-4 text-xl">Current Debt</h2>
          {leaderboardData && leaderboardData.map((row, i)=>
            <>
              <h3 key={`user${i}`} className="col-span-2 py-3 text-slate-300 text-center">{row[0]}</h3>
              <h3 key={`debt${i}`} className="col-span-2 py-3 text-slate-300 text-center">{row[1]}</h3>
            </>
          )}
          </div>
        }
      </div>
    );
};

export default Home;
