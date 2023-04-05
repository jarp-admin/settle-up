import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useMostDebted } from "~/hooks";

const Leaderboard: NextPage = () => {
  let { data: session } = useSession();
  let leaderboardData = useMostDebted();

  if (!leaderboardData) return <></>;
  return (
    <div className="-mt-20 flex h-screen w-full items-center justify-center overflow-clip font-mono">
      {leaderboardData && (
        <div className="min-w-60 grid max-w-max grid-cols-4 rounded-xl bg-slate-800 shadow-md md:w-96">
          <h2 className="col-span-2 rounded-tl-xl bg-slate-700 p-4 text-center text-xl font-semibold text-primary">
            User
          </h2>
          <h2 className="col-span-2 rounded-tr-xl bg-slate-700 p-4 text-center text-xl font-semibold text-primary">
            Current Debt
          </h2>
          {leaderboardData &&
            leaderboardData.map((row, i) => (
              <>
                <h3
                  key={`user${i}`}
                  className="col-span-2 py-3 text-center text-slate-300"
                >
                  {row[0]}
                </h3>
                <h3
                  key={`debt${i}`}
                  className="col-span-2 py-3 text-center text-slate-300"
                >
                  {row[1]}
                </h3>
              </>
            ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
