import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Graph from "~/components/Graph";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Settle-up!</title>
        <meta name="description" content="Discord Accountant Bot Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="absolute top-20">
        <h1 className="bg-slate-100/80">Booking done right</h1>
        <section>
          <h2>Features:</h2>
          <ul>
            <li>Keep track of who and what you owe</li>
            <li>Pay in your own time</li>
            <li>Avoid tedious, tiny transactions</li>
            <li>Automatically control</li>
          </ul>
        </section>
        <Link href="/">Invite to your discord server</Link>
        <div>
          <Graph
            data={[
              10, 10, 10, 15, 15, 15, 6, 6, 0, 0, 12, 12, 17, 17, 17, 17, 0,
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
