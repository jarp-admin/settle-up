import type { NextPage } from "next";
import { api } from "~/trpc";

const Leaderboard: NextPage = () => {
  const { data: leaderboardData } = api.leaderboard.getMostDebt.useQuery();

  if (!leaderboardData) return <></>;
  return (
    <div className="-mt-20 flex h-screen w-full items-center justify-center overflow-clip font-mono">
      {leaderboardData && (
        <div className="min-w-60 grid max-w-max grid-cols-4 rounded-xl bg-slate-800 shadow-md md:w-96">
          <h2 className="text-primary col-span-2 rounded-tl-xl bg-slate-700 p-4 text-center text-xl font-semibold">
            User
          </h2>
          <h2 className="text-primary col-span-2 rounded-tr-xl bg-slate-700 p-4 text-center text-xl font-semibold">
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
